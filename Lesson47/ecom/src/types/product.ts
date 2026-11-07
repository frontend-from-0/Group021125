import { z } from "zod";
import { Currency } from "./currency";

export enum ProductCategory {
  ELECTRONICS = "ELECTRONICS",
  CLOTHING = "CLOTHING",
  HOME = "HOME",
  SPORTS = "SPORTS",
  OTHER = "OTHER",
}

export const PRODUCT_CATEGORY_OPTIONS: {
  value: ProductCategory;
  label: string;
}[] = [
  { value: ProductCategory.ELECTRONICS, label: "Electronics" },
  { value: ProductCategory.CLOTHING, label: "Clothing" },
  { value: ProductCategory.HOME, label: "Home" },
  { value: ProductCategory.SPORTS, label: "Sports" },
  { value: ProductCategory.OTHER, label: "Other" },
];

export const PRODUCT_CATEGORY_FILTER_OPTIONS: {
  value: ProductCategory | "all";
  label: string;
}[] = [
  { value: "all", label: "All categories" },
  ...PRODUCT_CATEGORY_OPTIONS,
];

export function isProductCategory(value: string): value is ProductCategory {
  return Object.values(ProductCategory).includes(value as ProductCategory);
}

export function formatCategoryLabel(category: ProductCategory): string {
  const option = PRODUCT_CATEGORY_OPTIONS.find((item) => item.value === category);
  return option?.label ?? category;
}

export enum ProductSort {
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
}

export const PRODUCT_SORT_OPTIONS: {
  value: ProductSort;
  label: string;
}[] = [
  { value: ProductSort.NAME_ASC, label: "Name (A–Z)" },
  { value: ProductSort.NAME_DESC, label: "Name (Z–A)" },
  { value: ProductSort.PRICE_ASC, label: "Price (low to high)" },
  { value: ProductSort.PRICE_DESC, label: "Price (high to low)" },
];

export function isProductSort(value: string): value is ProductSort {
  return Object.values(ProductSort).includes(value as ProductSort);
}


export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  currency: Currency;
  category: ProductCategory;
  stock: number;
  imageUrls: readonly string[];
  isActive: boolean;
  priceId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
};

/** POST /api/ai/products body (Lesson 47). */
export const productDescriptionRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Enter a product name first (at least 2 characters).")
    .max(100, "Product name can be at most 100 characters."),
});

/** Structured output we ask the AI model to return. */
export const productDescriptionResponseSchema = z.object({
  description: z.string().min(50).max(500),
});

export type ProductDescriptionResponse = z.infer<typeof productDescriptionResponseSchema>;
