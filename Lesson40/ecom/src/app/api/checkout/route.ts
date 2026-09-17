import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';

import { stripe } from '@/lib/stripe';

const checkoutLineItemSchema = z.object({
  priceId: z
    .string()
    .trim()
    .min(1, 'Price ID is required')
    .startsWith('price_', 'Price ID must be a Stripe price ID'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be at least 1'),
});

const checkoutFormSchema = z.object({
  lineItems: z
    .array(checkoutLineItemSchema)
    .min(1, 'At least one product is required'),
});

function getAppOrigin(request: NextRequest, originHeader: string | null) {
  return originHeader ?? request.nextUrl.origin;
}

function parseCheckoutFormData(formData: FormData) {
  const priceIds = formData.getAll('priceId').map((value) => String(value));
  const quantities = formData.getAll('quantity').map((value) => String(value));

  const lineItems = priceIds.map((priceId, index) => ({
    priceId,
    quantity: quantities[index] ?? '',
  }));

  return checkoutFormSchema.parse({ lineItems });
}

export async function POST(request: NextRequest) {
  let origin = request.nextUrl.origin;

  try {
    const headersList = await headers();
    origin = getAppOrigin(request, headersList.get('origin'));
    const formData = await request.formData();
    const { lineItems } = parseCheckoutFormData(formData);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: 'payment',
      cancel_url: `${origin}/checkout/`,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        someSpecialValue:
          'Very special value that I want to show to the user.',
      },
    });

    if (!session.url) {
      throw new Error('Checkout session URL is missing');
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Checkout failed');
    console.error(
      'An internal error occured when creating a chekout session. Redirecting the user to the error page.',
      error,
    );
    return NextResponse.redirect(new URL('/checkout/error', origin), 303);
  }
}
