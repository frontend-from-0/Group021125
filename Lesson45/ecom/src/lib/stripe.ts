import 'server-only'

import Stripe from 'stripe'

const stripeKey = () => {
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY;
  } else {
    throw Error('Missing Stripe Secret key.')
  }
}

export const stripe = new Stripe(stripeKey());