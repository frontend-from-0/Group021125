import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleAlert, CircleCheck, Mail } from "lucide-react";
import type Stripe from "stripe";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your payment was successful. Review your order details.",
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <CheckoutStatusMessage
        title="We could not find this order"
        description="The confirmation link is missing a checkout session. If you just paid, return to your email receipt or continue shopping."
      />
    );
  }

  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    return (
      <CheckoutStatusMessage
        title="We could not find this order"
        description="This checkout session is invalid or has expired. If you were charged, check your email for a receipt from Stripe."
      />
    );
  }

  switch (session.status) {
    case "open":
      return redirect("/");
    case "expired":
      return (
        <CheckoutStatusMessage
          title="This checkout session expired"
          description="Your payment was not completed. Please return to the store and try again."
        />
      );
    case "complete":
      return <OrderConfirmation session={session} />;
    default:
      return (
        <CheckoutStatusMessage
          title="Order status unavailable"
          description="We could not confirm this checkout yet. If you completed payment, a confirmation email is on the way."
        />
      );
  }
}

function OrderConfirmation({
  session,
}: {
  session: Stripe.Checkout.Session;
}) {
  const customer = session.customer_details;
  const lineItems = session.line_items?.data ?? [];
  const currency = session.currency;
  const orderNumber = formatOrderNumber(session.id);
  const customerName =
    customer?.name ?? customer?.individual_name ?? customer?.business_name;
  const shipping = session.collected_information?.shipping_details;
  const billingAddress = formatAddressLines(customer?.address);
  const shippingAddress = formatAddressLines(shipping?.address);
  const paymentStatus = paymentStatusBadge(session.payment_status);
  const discount = session.total_details?.amount_discount ?? 0;
  const shippingAmount = session.total_details?.amount_shipping ?? 0;
  const tax = session.total_details?.amount_tax ?? 0;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CircleCheck className="size-7" aria-hidden="true" />
        </div>
        <Typography variant="page-title">Thank you for your order</Typography>
        <Typography variant="muted" className="mt-2 max-w-md">
          Your payment was successful. A confirmation
          {customer?.email ? (
            <>
              {" "}
              will be sent to{" "}
              <Typography as="span" variant="emphasis">
                {customer.email}
              </Typography>
            </>
          ) : (
            " email is on the way"
          )}
          .
        </Typography>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle>Order {orderNumber}</CardTitle>
                <CardDescription>
                  Placed {formatOrderDate(session.created)}
                </CardDescription>
              </div>
              <Badge variant={paymentStatus.variant}>{paymentStatus.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <OrderMeta label="Order reference" value={orderNumber} />
            <OrderMeta
              label="Payment"
              value={formatStripeAmount(session.amount_total, currency)}
            />
            {customerName ? (
              <OrderMeta label="Customer" value={customerName} />
            ) : null}
            {customer?.email ? (
              <OrderMeta label="Email" value={customer.email} />
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              {lineItems.length === 1
                ? "1 item in this order"
                : `${lineItems.length} items in this order`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {lineItems.length === 0 ? (
              <Typography variant="muted">
                Item details are unavailable for this order.
              </Typography>
            ) : (
              <ul className="divide-y divide-border">
                {lineItems.map((item) => {
                  const quantity = item.quantity ?? 1;
                  const unitAmount = item.price?.unit_amount ?? null;

                  return (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <Typography variant="emphasis">
                          {item.description ?? "Purchased item"}
                        </Typography>
                        <Typography variant="muted">
                          Qty {quantity}
                          {unitAmount != null
                            ? ` × ${formatStripeAmount(unitAmount, item.currency)}`
                            : null}
                        </Typography>
                      </div>
                      <Typography
                        variant="emphasis"
                        className="shrink-0"
                      >
                        {formatStripeAmount(item.amount_total, item.currency)}
                      </Typography>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            <TotalsRow
              label="Subtotal"
              value={formatStripeAmount(session.amount_subtotal, currency)}
            />
            {discount > 0 ? (
              <TotalsRow
                label="Discount"
                value={`−${formatStripeAmount(discount, currency)}`}
              />
            ) : null}
            {shippingAmount > 0 ? (
              <TotalsRow
                label="Shipping"
                value={formatStripeAmount(shippingAmount, currency)}
              />
            ) : null}
            {tax > 0 ? (
              <TotalsRow
                label="Tax"
                value={formatStripeAmount(tax, currency)}
              />
            ) : null}
            <Separator />
            <TotalsRow
              label="Total paid"
              value={formatStripeAmount(session.amount_total, currency)}
              emphasized
            />
          </CardFooter>
        </Card>

        {customerName || customer?.email || billingAddress.length > 0 || shipping ? (
          <Card>
            <CardHeader>
              <CardTitle>Customer details</CardTitle>
              <CardDescription>
                Contact and address information from checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <Typography variant="overline">Contact</Typography>
                {customerName ? (
                  <Typography variant="body">{customerName}</Typography>
                ) : null}
                {customer?.email ? (
                  <Typography
                    variant="muted"
                    className="flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                    {customer.email}
                  </Typography>
                ) : null}
                {customer?.phone ? (
                  <Typography variant="muted">{customer.phone}</Typography>
                ) : null}
              </div>

              {shipping ? (
                <div className="space-y-1">
                  <Typography variant="overline">Shipping address</Typography>
                  {shipping.name ? (
                    <Typography variant="body">{shipping.name}</Typography>
                  ) : null}
                  {shippingAddress.map((line) => (
                    <Typography key={line} variant="muted">
                      {line}
                    </Typography>
                  ))}
                </div>
              ) : billingAddress.length > 0 ? (
                <div className="space-y-1">
                  <Typography variant="overline">Billing address</Typography>
                  {billingAddress.map((line) => (
                    <Typography key={line} variant="muted">
                      {line}
                    </Typography>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <Typography variant="muted">
            Questions? Email{" "}
            <Typography asChild variant="emphasis" className="underline-offset-4 hover:underline">
              <a href="mailto:orders@example.com">orders@example.com</a>
            </Typography>
          </Typography>
          <Button asChild>
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function CheckoutStatusMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
      <Card className="w-full">
        <CardHeader className="justify-items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CircleAlert className="size-6" aria-hidden="true" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/">Continue shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <Typography variant="overline">{label}</Typography>
      <Typography variant="body">{value}</Typography>
    </div>
  );
}

function TotalsRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Typography variant={emphasized ? "strong" : "muted"} as="span">
        {label}
      </Typography>
      <Typography
        variant={emphasized ? "section-title" : "body"}
        as="span"
      >
        {value}
      </Typography>
    </div>
  );
}

function formatOrderNumber(sessionId: string): string {
  return `#${sessionId.slice(-8).toUpperCase()}`;
}

function formatOrderDate(created: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(created * 1000));
}

function formatStripeAmount(
  amount: number | null | undefined,
  currency: string | null | undefined,
): string {
  if (amount == null || !currency) {
    return "—";
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatAddressLines(
  address: Stripe.Address | null | undefined,
): string[] {
  if (!address) {
    return [];
  }

  return [
    address.line1,
    address.line2,
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.state,
    address.country,
  ].filter((line): line is string => Boolean(line));
}

function paymentStatusBadge(status: Stripe.Checkout.Session.PaymentStatus): {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
} {
  switch (status) {
    case "paid":
      return { label: "Paid", variant: "default" };
    case "unpaid":
      return { label: "Unpaid", variant: "destructive" };
    case "no_payment_required":
      return { label: "No payment required", variant: "secondary" };
    default:
      return { label: status, variant: "outline" };
  }
}
