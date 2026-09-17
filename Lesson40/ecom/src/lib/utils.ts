import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { FieldOutputTypes } from "@/prisma/contract";
import type { Currency } from "@/types/currency";
import type { Product, ProductCategory } from "@/types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DbProduct = FieldOutputTypes["__unbound__"]["Product"];

export function toAppProduct(product: DbProduct): Product {
  return {
    id: String(product._id),
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency as Currency,
    category: product.category as ProductCategory,
    stock: product.stock,
    imageUrls: product.imageUrls,
    stripePriceId: product.stripePriceId,
    stripeProductId: product.stripeProductId,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
