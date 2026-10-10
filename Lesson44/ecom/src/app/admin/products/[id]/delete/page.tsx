import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { getProductById } from "@/lib/products";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <div className="space-y-1">
        <Typography variant="page-title">Delete product</Typography>
        <Typography variant="muted">{product.name}</Typography>
      </div>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Confirm deletion</CardTitle>
          <CardDescription>
            This is a placeholder page. Product deletion will be implemented in a
            later lesson.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="destructive" disabled>
            Delete product
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
