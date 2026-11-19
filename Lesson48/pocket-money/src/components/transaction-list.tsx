import Link from "next/link";

import { DeleteTransactionButton } from "@/components/delete-transaction-button";
import { buttonVariants } from "@/components/ui/button";
import { formatEur } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { AppTransaction } from "@/types/transaction";

type TransactionListProps = {
  transactions: AppTransaction[];
  filtered: boolean;
};

function formatWhen(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function TransactionList({
  transactions,
  filtered,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/60 px-5 py-10 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">
          {filtered ? "Nothing matches that filter" : "Your list is empty"}
        </p>
        <p className="mt-2 text-base text-muted-foreground">
          {filtered
            ? "Try clearing filters or picking a wider date range."
            : "Add money you got or spent — your balance updates right away."}
        </p>
        {!filtered ? (
          <Link
            href="/transactions/new"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-5 inline-flex h-12 rounded-2xl px-5 text-base font-semibold",
            )}
          >
            Add your first amount
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {transactions.map((tx) => {
        const isIncome = tx.type === "income";
        return (
          <li
            key={tx.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground">{tx.category}</p>
              <p className="text-sm text-muted-foreground">
                {isIncome ? "Money in" : "Money out"} · {formatWhen(tx.occurredAt)}
              </p>
              <div className="mt-2 flex gap-2">
                <Link
                  href={`/transactions/${tx.id}/edit`}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Edit
                </Link>
                <DeleteTransactionButton id={tx.id} />
              </div>
            </div>
            <p
              className={
                isIncome
                  ? "shrink-0 text-lg font-semibold text-[var(--money-in)]"
                  : "shrink-0 text-lg font-semibold text-[var(--money-out)]"
              }
            >
              {isIncome ? "+" : "−"}
              {formatEur(tx.amountCents)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
