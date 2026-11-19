"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MongoFieldFilter } from "@prisma/orm-mongo/query-ast/execution";

import { requireUserWithDbId } from "@/lib/auth";
import type { Category } from "@/lib/categories";
import { parseAmountToCents } from "@/lib/money";
import { transactionFormSchema } from "@/lib/validation/transaction";
import { getLocalWeekBounds } from "@/lib/week";
import { db } from "@/prisma/db";
import type { AppTransaction, MoneySummary } from "@/types/transaction";

type DbTransaction = {
  id: unknown;
  userId: unknown;
  type: "income" | "expense";
  amountCents: number;
  category: Category;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

function toAppTransaction(row: DbTransaction): AppTransaction {
  return {
    id: String(row.id),
    userId: String(row.userId),
    type: row.type,
    amountCents: row.amountCents,
    category: row.category,
    occurredAt: new Date(row.occurredAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function datetimeLocalToIso(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function parseOptionalDateBoundary(
  value: string | undefined,
  endOfDay: boolean,
): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date.toISOString();
}

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function listTransactions(filters?: {
  from?: string;
  to?: string;
  category?: string;
}): Promise<AppTransaction[]> {
  const { mongoUserId } = await requireUserWithDbId();

  let query = db.orm.transactions.where({ userId: mongoUserId });

  const from = parseOptionalDateBoundary(filters?.from, false);
  const to = parseOptionalDateBoundary(filters?.to, true);

  if (from) {
    query = query.where(MongoFieldFilter.gte("occurredAt", from));
  }
  if (to) {
    query = query.where(MongoFieldFilter.lte("occurredAt", to));
  }
  if (filters?.category) {
    query = query.where({ category: filters.category as Category });
  }

  const rows = await query.orderBy({ occurredAt: -1 }).all();
  return rows.map((row) => toAppTransaction(row as unknown as DbTransaction));
}

export async function getTransactionById(
  id: string,
): Promise<AppTransaction | null> {
  const { mongoUserId } = await requireUserWithDbId();
  const row = await db.orm.transactions
    .where({ id, userId: mongoUserId })
    .first();
  if (!row) return null;
  return toAppTransaction(row as unknown as DbTransaction);
}

export async function getMoneySummary(): Promise<MoneySummary> {
  const { mongoUserId } = await requireUserWithDbId();
  const rows = await db.orm.transactions.where({ userId: mongoUserId }).all();
  const { weekStart, weekEnd } = getLocalWeekBounds();

  let balanceCents = 0;
  let weekSpentCents = 0;
  let weekReceivedCents = 0;

  for (const row of rows) {
    const tx = row as unknown as DbTransaction;
    if (tx.type === "income") {
      balanceCents += tx.amountCents;
    } else {
      balanceCents -= tx.amountCents;
    }

    const occurred = new Date(tx.occurredAt);
    if (occurred >= weekStart && occurred <= weekEnd) {
      if (tx.type === "income") {
        weekReceivedCents += tx.amountCents;
      } else {
        weekSpentCents += tx.amountCents;
      }
    }
  }

  return { balanceCents, weekSpentCents, weekReceivedCents };
}

async function parseFormData(formData: FormData) {
  const parsed = transactionFormSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    occurredAt: formData.get("occurredAt"),
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Please check the form",
    };
  }

  const amountCents = parseAmountToCents(parsed.data.amount);
  if (amountCents === null) {
    return { ok: false as const, error: "Enter a valid amount like 12.50" };
  }

  const occurredAt = datetimeLocalToIso(parsed.data.occurredAt);
  if (!occurredAt) {
    return { ok: false as const, error: "Pick a valid date and time" };
  }

  return {
    ok: true as const,
    data: {
      type: parsed.data.type,
      category: parsed.data.category,
      amountCents,
      occurredAt,
    },
  };
}

export async function createTransaction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const { mongoUserId } = await requireUserWithDbId();
  const parsed = await parseFormData(formData);
  if (!parsed.ok) return parsed;

  const now = new Date().toISOString();
  await db.orm.transactions.create({
    userId: mongoUserId,
    type: parsed.data.type,
    category: parsed.data.category,
    amountCents: parsed.data.amountCents,
    occurredAt: parsed.data.occurredAt,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/home");
  redirect("/home");
}

export async function updateTransaction(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const { mongoUserId } = await requireUserWithDbId();
  const existing = await db.orm.transactions
    .where({ id, userId: mongoUserId })
    .first();
  if (!existing) {
    return { ok: false, error: "Transaction not found" };
  }

  const parsed = await parseFormData(formData);
  if (!parsed.ok) return parsed;

  await db.orm.transactions.where({ id, userId: mongoUserId }).update({
    type: parsed.data.type,
    category: parsed.data.category,
    amountCents: parsed.data.amountCents,
    occurredAt: parsed.data.occurredAt,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/home");
  redirect("/home");
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const { mongoUserId } = await requireUserWithDbId();
  const existing = await db.orm.transactions
    .where({ id, userId: mongoUserId })
    .first();
  if (!existing) {
    return { ok: false, error: "Transaction not found" };
  }

  await db.orm.transactions.where({ id, userId: mongoUserId }).delete();
  revalidatePath("/home");
  return { ok: true };
}
