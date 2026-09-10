import { parseStorefrontFiltersFromSearchParams } from "@/lib/validation";
import { db } from '@/prisma/db';
import { Currency } from "@/types/currency";
import { type ProductCategory, type ProductSort } from "@/types/product";

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
  createdAt: Date;
  updatedAt: Date;
};

export type GetStorefrontProductsFilters = {
  category?: ProductCategory | "all";
  sort?: ProductSort;
};

export async function getStorefrontProducts(
  _filters: GetStorefrontProductsFilters = {},
): Promise<Product[]> {
  const products = await db.orm.products.where({ isActive: true }).all();

  return products.map((product) => ({
    id: String(product._id),
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency as Currency,
    category: product.category as ProductCategory,
    stock: product.stock,
    imageUrls: product.imageUrls,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));
}

export async function getAllProducts(): Promise<Product[]> {
  return [];
}

export async function getProductById(_id: string): Promise<Product | null> {
  return null;
}

export function parseStorefrontFilters(
  searchParams: Record<string, string | string[] | undefined>,
): { categoryValue: ProductCategory | "all"; sortValue: ProductSort } {
  const { category, sort } =
    parseStorefrontFiltersFromSearchParams(searchParams);

  return { categoryValue: category, sortValue: sort };
}
