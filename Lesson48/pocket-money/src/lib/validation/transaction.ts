import { z } from "zod";

import { CATEGORIES, TRANSACTION_TYPES } from "@/lib/categories";

export const transactionFormSchema = z.object({
  type: z.enum(TRANSACTION_TYPES),
  amount: z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, "Enter a valid amount like 12.50")
    .refine((value) => {
      const euros = Number(value.replace(",", "."));
      return Number.isFinite(euros) && euros > 0;
    }, "Amount must be greater than zero"),
  category: z.enum(CATEGORIES),
  occurredAt: z.string().min(1, "Pick a date and time"),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const transactionFiltersSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.enum(CATEGORIES).optional().or(z.literal("")),
});

export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;
