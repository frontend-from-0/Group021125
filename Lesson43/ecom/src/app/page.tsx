import { ProductCatalog } from "@/components/storefront/product-catalog";
import { Typography } from "@/components/ui/typography";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8 space-y-2">
        <Typography variant="page-title">Products</Typography>
        <Typography variant="muted">
          Browse our catalog. Filter by category or sort by name and price.
        </Typography>
      </div>
      <ProductCatalog searchParams={resolvedSearchParams} />
    </main>
  );
}
