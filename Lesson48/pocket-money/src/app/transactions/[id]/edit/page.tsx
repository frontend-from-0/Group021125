import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getTransactionById,
  updateTransaction,
} from "@/actions/transactions";
import { TransactionForm } from "@/components/transaction-form";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type EditTransactionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTransactionPage({
  params,
}: EditTransactionPageProps) {
  await requireUser();
  const { id } = await params;
  const transaction = await getTransactionById(id);
  if (!transaction) notFound();

  const action = updateTransaction.bind(null, id);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
          Edit transaction
        </h1>
        <Link
          href="/home"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Cancel
        </Link>
      </div>
      <TransactionForm
        action={action}
        initial={transaction}
        submitLabel="Save changes"
      />
    </main>
  );
}
