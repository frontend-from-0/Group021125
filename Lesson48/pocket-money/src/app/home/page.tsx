import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import {
  getMoneySummary,
  listTransactions,
} from "@/actions/transactions";
import { TransactionFilters } from "@/components/transaction-filters";
import { TransactionList } from "@/components/transaction-list";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { isCategory } from "@/lib/categories";
import { formatEur } from "@/lib/money";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    category?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  await requireUser();
  const params = await searchParams;
  const category =
    params.category && isCategory(params.category)
      ? params.category
      : undefined;
  const filters = {
    from: params.from,
    to: params.to,
    category,
  };
  const filtered = Boolean(filters.from || filters.to || filters.category);

  const [summary, transactions] = await Promise.all([
    getMoneySummary(),
    listTransactions(filters),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-7 px-5 py-7 sm:py-9">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground">
            PocketMoney
          </p>
          <h1 className="mt-1 text-base text-muted-foreground">
            Here’s what you’ve got right now
          </h1>
        </div>
        <Link
          href="/auth/logout"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mt-1 rounded-xl",
          )}
        >
          Log out
        </Link>
      </header>

      <section className="rounded-[1.75rem] bg-[linear-gradient(145deg,var(--balance-from),var(--balance-to))] p-6 text-[var(--balance-fg)] shadow-[0_18px_40px_-24px_oklch(0.35_0.08_180_/_0.7)]">
        <p className="text-sm font-medium opacity-90">You have</p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-5xl font-bold tracking-tight">
          {formatEur(summary.balanceCents)}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-black/12 px-3.5 py-3">
            <p className="opacity-85">Spent this week</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatEur(summary.weekSpentCents)}
            </p>
          </div>
          <div className="rounded-2xl bg-black/12 px-3.5 py-3">
            <p className="opacity-85">Got this week</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatEur(summary.weekReceivedCents)}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            Your list
          </h2>
          <div className="flex items-center gap-2">
            <Suspense fallback={null}>
              <TransactionFilters />
            </Suspense>
            <Link
              href="/transactions/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-1.5 rounded-2xl px-4 text-base font-semibold",
              )}
            >
              <Plus className="size-5" aria-hidden />
              Add
            </Link>
          </div>
        </div>
        <TransactionList transactions={transactions} filtered={filtered} />
      </section>
    </main>
  );
}
