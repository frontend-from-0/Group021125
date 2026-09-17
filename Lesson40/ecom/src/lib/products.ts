'use server';

import { toAppProduct } from "@/lib/utils";
import { db } from "@/prisma/db";
import {
  Product,
  ProductSort,
  type ProductCategory,
} from "@/types/product";

export type GetStorefrontProductsFilters = {
  category?: ProductCategory | "all";
  sort?: ProductSort;
};

function storefrontOrderBy(
  sort: ProductSort = ProductSort.NAME_ASC,
): { name: 1 | -1 } | { priceCents: 1 | -1 } {
  switch (sort) {
    case ProductSort.NAME_ASC:
      return { name: 1 };
    case ProductSort.NAME_DESC:
      return { name: -1 };
    case ProductSort.PRICE_ASC:
      return { priceCents: 1 };
    case ProductSort.PRICE_DESC:
      return { priceCents: -1 };
    default: {
      const _exhaustive: never = sort;
      return _exhaustive;
    }
  }
}

export async function getStorefrontProducts(
  filters: GetStorefrontProductsFilters = {},
): Promise<Product[]> {
  const category = filters.category ?? "all";
  const sort = filters.sort ?? ProductSort.NAME_ASC;

  const query =
    category === "all"
      ? db.orm.products.where({ isActive: true })
      : db.orm.products.where({ isActive: true, category });

  const products = await query.orderBy(storefrontOrderBy(sort)).all();
  return products.map(toAppProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await db.orm.products.orderBy({ createdAt: -1 }).all();
  return products.map(toAppProduct);
}

export async function getProductById(_id: string): Promise<Product | null> {
  return null;
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Promise<Product | null> {
  const now = new Date();
  const createdProduct = await db.orm.products.create({
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency,
    category: product.category,
    stock: product.stock,
    imageUrls: product.imageUrls,
    isActive: product.isActive,
    createdAt: now,
    updatedAt: now,
  });

  return toAppProduct(createdProduct);
}
