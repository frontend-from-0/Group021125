"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { callOrdersApi, type OrdersApiTestResult } from "./actions";

export function OrdersApiTester() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<OrdersApiTestResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(kind: "my-orders" | "all-orders" | "order-by-id") {
    startTransition(async () => {
      setResult(await callOrdersApi({ kind, orderId }));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button disabled={isPending} onClick={() => run("my-orders")}>
          GET /v1/orders
        </Button>
        <Button disabled={isPending} onClick={() => run("all-orders")}>
          GET /v1/orders/all
        </Button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="order_1"
          disabled={isPending}
        />
        <Button
          disabled={isPending || orderId.trim().length === 0}
          onClick={() => run("order-by-id")}
        >
          GET /v1/orders/:id
        </Button>
      </div>
      {result ? (
        <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
