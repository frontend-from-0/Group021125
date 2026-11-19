"use client";

import { useActionState } from "react";

import type { ActionResult } from "@/actions/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { centsToEuros } from "@/lib/money";
import type { AppTransaction } from "@/types/transaction";

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type TransactionFormProps = {
  action: (
    prev: ActionResult | undefined,
    formData: FormData,
  ) => Promise<ActionResult>;
  initial?: AppTransaction;
  submitLabel: string;
};

export function TransactionForm({
  action,
  initial,
  submitLabel,
}: TransactionFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const defaultOccurredAt = toDatetimeLocalValue(
    initial?.occurredAt ? new Date(initial.occurredAt) : new Date(),
  );
  const defaultAmount = initial
    ? centsToEuros(initial.amountCents).toFixed(2)
    : "";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Type</Label>
        <Select
          name="type"
          defaultValue={initial?.type ?? "expense"}
          required
        >
          <SelectTrigger id="type" className="h-11 w-full">
            <SelectValue placeholder="Choose type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Money in</SelectItem>
            <SelectItem value="expense">Money out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Amount (€)</Label>
        <Input
          id="amount"
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="12.50"
          defaultValue={defaultAmount}
          required
          className="h-11 text-base"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          defaultValue={initial?.category ?? "Food"}
          required
        >
          <SelectTrigger id="category" className="h-11 w-full">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="occurredAt">Date and time</Label>
        <Input
          id="occurredAt"
          name="occurredAt"
          type="datetime-local"
          defaultValue={defaultOccurredAt}
          required
          className="h-11 text-base"
        />
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-12 text-base" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
