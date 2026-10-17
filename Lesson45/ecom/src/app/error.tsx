"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <Typography variant="error-title">Something went wrong</Typography>
      <Typography variant="muted">
        We could not load this page. Please try again.
      </Typography>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
