'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/typography/H1';
import { Small } from '@/components/ui/typography/Small';
import { toggleQuoteLike } from '@/actions/quotes';
import { Quote } from '@/types/quotes';
import { HeartBreakIcon, HeartIcon } from '@phosphor-icons/react';

interface HomeQuotesProps {
  initialQuotes: Quote[];
  userId: string | null;
}

export function HomeQuotes({ initialQuotes, userId }: HomeQuotesProps) {
  const [index, setIndex] = useState(0);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [isPending, startTransition] = useTransition();

  const currentQuote = quotes[index];

  function handleNextClick() {
    if (index < quotes.length - 1) setIndex(index + 1);
  }

  function handlePrevClick() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function handleLike() {
    if (!currentQuote || !userId) {
      return;
    }

    startTransition(async () => {
      const result = await toggleQuoteLike(currentQuote.id);

      if (!result.success || !result.quote) {
        return;
      }

      setQuotes((previousQuotes) =>
        previousQuotes.map((quote) =>
          quote.id === result.quote?.id ? result.quote : quote,
        ),
      );
    });
  }

  if (!currentQuote) {
    return (
      <main className='w-full max-w-3xl mx-auto flex items-center justify-center py-32 px-16'>
        <p>No quotes yet. Add one from the new quote page.</p>
      </main>
    );
  }

  const isLikedQuote =
    userId != null && currentQuote.likedBy.includes(userId);

  const likeIcon = isLikedQuote ? (
    <HeartBreakIcon
      weight='fill'
      className='size-8 text-muted-foreground'
    />
  ) : (
    <HeartIcon weight='fill' className='size-8 text-destructive' />
  );

  return (
    <main className='w-full max-w-3xl mx-auto flex items-center justify-center py-32 px-16 sm:items-start'>
      <div>
        <div className='flex justify-end gap-2'>
          {userId ? (
            <Button
              onClick={handleLike}
              variant='ghost'
              disabled={isPending}
              aria-label={isLikedQuote ? 'Unlike quote' : 'Like quote'}
            >
              {likeIcon}
            </Button>
          ) : (
            <Button asChild variant='ghost'>
              <Link href='/auth/login' aria-label='Log in to like this quote'>
                {likeIcon}
              </Link>
            </Button>
          )}
        </div>

        <H1>{currentQuote.quote}</H1>
        <div className='flex justify-end my-8'>
          <Small>- {currentQuote.author}</Small>
        </div>

        <div className='flex justify-center gap-4'>
          <Button onClick={handlePrevClick} disabled={index === 0} size='lg'>
            Previous quote
          </Button>
          <Button
            onClick={handleNextClick}
            disabled={index === quotes.length - 1}
            size='lg'
          >
            Next quote
          </Button>
        </div>
      </div>
    </main>
  );
}
