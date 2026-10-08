"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchAllOrders, fetchMyOrders, fetchOrderById } from "./actions";

export function OrdersApiTester() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              setResult(await fetchMyOrders());
            })
          }
        >
          GET /v1/orders
        </Button>
        <Button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              setResult(await fetchAllOrders());
            })
          }
        >
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
          onClick={() =>
            startTransition(async () => {
              setResult(await fetchOrderById(orderId.trim()));
            })
          }
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
