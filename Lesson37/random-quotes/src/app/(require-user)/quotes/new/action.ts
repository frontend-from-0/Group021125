'use server';

import { auth0 } from '@/lib/auth0';
import { createQuote } from '@/actions/quotes';
import { NewQuoteFormState, NewQuoteSchema } from '@/types/quotes';
import z from 'zod';

export async function handleNewQuote(
  _currentState: NewQuoteFormState,
  formData: FormData,
): Promise<NewQuoteFormState> {
  const session = await auth0.getSession();

  if (!session) {
    return {
      success: false,
      message: 'Please log in to save the quote',
    };
  }

  const rawData = {
    quote: formData.get('quote') ?? '',
    author: formData.get('author') ?? '',
  };

  const safeParsedResult = NewQuoteSchema.safeParse(rawData);

  if (!safeParsedResult.success) {
    const errors = z.flattenError(safeParsedResult.error);

    return {
      success: false,
      errors: {
        fieldErrors: errors.fieldErrors,
      },
      data: {
        quote: String(rawData.quote),
        author: String(rawData.author),
      },
    };
  }

  const insertResult = await createQuote(safeParsedResult.data);

  if (!insertResult.success) {
    return {
      success: false,
      message: insertResult.message ?? 'Could not save the quote',
      data: {
        quote: safeParsedResult.data.quote,
        author: safeParsedResult.data.author,
      },
    };
  }

  return {
    success: true,
  };
}
