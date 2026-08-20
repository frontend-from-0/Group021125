'use server';

import { revalidatePath } from 'next/cache';
import { auth0 } from '@/lib/auth0';
import {
  deleteQuoteById,
  insertQuote,
  listAllQuotes,
  listFavouriteQuotes,
  updateQuoteLikedBy,
} from '@/repositories/quotes';
import type { Quote } from '@/types/quotes';

export interface QuotesActionResult {
  success: boolean;
  message?: string;
  quotes?: Quote[];
  quote?: Quote;
}

async function requireUserId(): Promise<
  { ok: true; userId: string } | { ok: false; result: QuotesActionResult }
> {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    return {
      ok: false,
      result: {
        success: false,
        message: 'Please log in to continue',
      },
    };
  }

  return { ok: true, userId: session.user.sub };
}

function revalidateQuotePages(): void {
  revalidatePath('/');
  revalidatePath('/user/quotes/favourite');
}

export async function getQuotes(): Promise<Quote[]> {
  return listAllQuotes();
}

export async function getFavouriteQuotes(): Promise<QuotesActionResult> {
  const auth = await requireUserId();

  if (auth.ok === false) {
    return { ...auth.result, quotes: [] };
  }

  const quotes = await listFavouriteQuotes(auth.userId);
  return { success: true, quotes };
}

export async function createQuote(input: {
  quote: string;
  author: string;
}): Promise<QuotesActionResult> {
  const auth = await requireUserId();

  if (auth.ok === false) {
    return auth.result;
  }

  const quote = await insertQuote({
    quote: input.quote,
    author: input.author,
    createdBy: auth.userId,
  });
  revalidateQuotePages();
  return { success: true, quote };
}

export async function toggleQuoteLike(
  quoteId: string,
): Promise<QuotesActionResult> {
  const auth = await requireUserId();

  if (auth.ok === false) {
    return auth.result;
  }

  const quote = await updateQuoteLikedBy(quoteId, auth.userId);

  if (!quote) {
    return { success: false, message: 'Quote not found' };
  }

  revalidateQuotePages();
  return { success: true, quote };
}

export async function deleteQuote(quoteId: string): Promise<QuotesActionResult> {
  const auth = await requireUserId();

  if (auth.ok === false) {
    return auth.result;
  }

  const deleted = await deleteQuoteById(quoteId);

  if (!deleted) {
    return { success: false, message: 'Quote not found' };
  }

  revalidateQuotePages();
  return { success: true };
}
