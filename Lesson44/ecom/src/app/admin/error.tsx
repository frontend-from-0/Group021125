"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

type AdminErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminErrorPage({ error, reset }: AdminErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <Typography variant="heading">Admin error</Typography>
      <Typography variant="muted" className="max-w-md">
        Something went wrong in the admin area.
      </Typography>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
