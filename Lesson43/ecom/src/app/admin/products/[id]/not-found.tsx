import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function ProductNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <Typography variant="error-title">Product not found</Typography>
      <Typography variant="muted">
        The product you are looking for does not exist or was removed.
      </Typography>
      <Button asChild variant="outline">
        <Link href="/admin/products">Back to products</Link>
      </Button>
    </main>
  );
}
