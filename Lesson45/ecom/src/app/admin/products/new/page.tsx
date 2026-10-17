import type { Metadata } from "next";

import { Typography } from "@/components/ui/typography";

import { CreateProductForm } from "./create-product-form";

export const metadata: Metadata = {
  title: "Create product | Admin",
  description: "Add a new product to the store",
};

export default function NewProductPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <div className="space-y-2">
        <Typography variant="page-title">Create product</Typography>
        <Typography variant="muted">
          Save product data with Prisma + MongoDB and upload images to Vercel Blob.
        </Typography>
      </div>

      <CreateProductForm />
    </main>
  );
}
