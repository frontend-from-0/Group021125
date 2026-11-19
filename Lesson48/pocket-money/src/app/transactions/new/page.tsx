import Link from "next/link";

import { createTransaction } from "@/actions/transactions";
import { TransactionForm } from "@/components/transaction-form";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewTransactionPage() {
  await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Add transaction
        </h1>
        <Link
          href="/home"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Cancel
        </Link>
      </div>
      <TransactionForm action={createTransaction} submitLabel="Save" />
    </main>
  );
}
