import Link from 'next/link';
import { getFavouriteQuotes, deleteQuote } from '@/actions/quotes';
import { Button } from '@/components/ui/button';

// Always render per request: this page uses the Auth0 session and live Mongo data.
export const dynamic = 'force-dynamic';

export default async function FavouriteQuotesPage() {
  const result = await getFavouriteQuotes();

  if (!result.success) {
    return (
      <main className='flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16'>
        <p>{result.message ?? 'Please log in to see favourite quotes.'}</p>
        <a href='/auth/login'>Log in</a>
      </main>
    );
  }

  const likedQuotes = result.quotes ?? [];

  return (
    <main className='flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start'>
      {likedQuotes.map((quote) => (
        <div key={quote.id} className='mb-8 w-full'>
          <p>{quote.quote}</p>
          <span>- {quote.author}</span>
          <form action={deleteQuote.bind(null, quote.id)} className='mt-2'>
            <Button type='submit' variant='ghost' size='sm'>
              Remove quote
            </Button>
          </form>
        </div>
      ))}

      {likedQuotes.length === 0 ? (
        <h1>
          No quotes were liked yet. Check quotes <Link href='/'>here</Link>
        </h1>
      ) : null}
    </main>
  );
}
