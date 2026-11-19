import type { Category, TransactionType } from "@/lib/categories";

export type AppTransaction = {
  id: string;
  userId: string;
  type: TransactionType;
  amountCents: number;
  category: Category;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type MoneySummary = {
  balanceCents: number;
  weekSpentCents: number;
  weekReceivedCents: number;
};
