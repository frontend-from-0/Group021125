export const CATEGORIES = [
  "Allowance",
  "Gifts",
  "Food",
  "Games",
  "Savings",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function isTransactionType(value: string): value is TransactionType {
  return (TRANSACTION_TYPES as readonly string[]).includes(value);
}
