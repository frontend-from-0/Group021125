"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/categories";

export function TransactionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");

  function applyFilters() {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (category) params.set("category", category);
    const query = params.toString();
    router.push(query ? `/home?${query}` : "/home");
    setOpen(false);
  }

  function clearFilters() {
    setFrom("");
    setTo("");
    setCategory("");
    router.push("/home");
    setOpen(false);
  }

  const hasFilters = Boolean(
    searchParams.get("from") ||
      searchParams.get("to") ||
      searchParams.get("category"),
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" className="h-11" />}>
        {hasFilters ? "Filters on" : "Filters"}
      </SheetTrigger>
      <SheetContent side="bottom" className="gap-4 rounded-t-2xl p-6">
        <SheetHeader>
          <SheetTitle>Filter transactions</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="from">From date</Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="to">To date</Label>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category || null}
              onValueChange={(value) => setCategory(value ?? "")}
            >
              <SelectTrigger id="category" className="h-11 w-full">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            onClick={clearFilters}
          >
            Clear
          </Button>
          <Button type="button" className="h-11 flex-1" onClick={applyFilters}>
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
