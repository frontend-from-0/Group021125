'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/typography/H1';
import { Small } from '@/components/ui/typography/Small';
import { HeartBreakIcon, HeartIcon } from '@phosphor-icons/react';
import { Quote } from '@/types/quotes';

interface HomeProps {
  initialQuotes: Quote[];
  userId: string | null;
}

export default function Home({ initialQuotes, userId }: HomeProps) {
  const [index, setIndex] = useState<number>(0);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  function handleNextClick() {
    if (index < quotes.length - 1) setIndex(index + 1);
  }

  function handlePrevClick() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function handleLike() {
    setQuotes((prevQuotes) => {
      return prevQuotes.map((quote, elementIndex) => {
        if (elementIndex === index) {
          return {
            ...quote,
            likedBy: [...quote.likedBy, 'userId'],
          };
        }
        return quote;
      });
    });
  }

  const isLikedQuote = () => quotes[index].likedBy.includes('userId');

  return (
    <main className='w-full max-w-3xl mx-auto flex items-center justify-center py-32 px-16 sm:items-start'>
      <div>
        <div className='flex justify-end'>
          <Button onClick={handleLike} variant='ghost'>
            {isLikedQuote() ? (
              <HeartBreakIcon
                weight='fill'
                className='size-8 text-muted-foreground'
              />
            ) : (
              <HeartIcon weight='fill' className='size-8 text-destructive' />
            )}
          </Button>
        </div>

        <H1>{quotes[index].quote}</H1>
        <div className='flex justify-end my-8'>
          <Small>- {quotes[index].author}</Small>
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
