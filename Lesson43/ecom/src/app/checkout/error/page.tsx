import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function SomethingWentWrongPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <Typography variant="error-title">Something went wrong</Typography>
      <Typography variant="muted">
        We could not complete your checkout. Please try again.
      </Typography>
      <Button asChild>
        <Link href="/">Back to products</Link>
      </Button>
    </main>
  );
}

export default SomethingWentWrongPage;
