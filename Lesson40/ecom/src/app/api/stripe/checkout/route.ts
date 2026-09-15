// localhost:3000/stripe/checkout
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')


    const formData = await req.formData();
    const priceId = formData.get('price_id') || '' as string;
    const quantity = Number(formData.get('quantity')) || 0;

    // use zod to validate form data!!!!

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err: unknown) {
    const error = err as { message?: string; statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}
