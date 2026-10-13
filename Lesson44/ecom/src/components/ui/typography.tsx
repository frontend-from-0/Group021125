import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      "page-title": "text-2xl font-semibold tracking-tight",
      "section-title": "text-base font-semibold",
      heading: "text-lg font-semibold",
      "error-title": "text-xl font-semibold",
      body: "text-sm",
      muted: "text-sm text-muted-foreground",
      emphasis: "font-medium",
      strong: "text-sm font-semibold",
      overline:
        "text-xs font-medium uppercase tracking-wide text-muted-foreground",
      "empty-title": "text-sm font-medium",
      error: "text-sm text-destructive",
      caption: "text-xs text-muted-foreground",
      brand: "text-sm font-semibold tracking-tight",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

const defaultElements = {
  "page-title": "h1",
  "section-title": "h2",
  heading: "h2",
  "error-title": "h1",
  body: "p",
  muted: "p",
  emphasis: "p",
  strong: "span",
  overline: "p",
  "empty-title": "p",
  error: "p",
  caption: "p",
  brand: "span",
} as const satisfies Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  React.ElementType
>

type TypographyProps = React.ComponentProps<"p"> &
  VariantProps<typeof typographyVariants> & {
    as?: React.ElementType
    asChild?: boolean
  }

function Typography({
  className,
  variant = "body",
  as,
  asChild = false,
  ...props
}: TypographyProps) {
  const Comp = asChild
    ? Slot.Root
    : (as ?? defaultElements[variant ?? "body"])

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
