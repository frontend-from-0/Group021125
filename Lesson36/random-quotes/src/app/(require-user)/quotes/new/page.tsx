'use client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { handleNewQuote } from './action';
import { useActionState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { redirect } from 'next/navigation';
import { NewQuoteFormState, NewQuoteSchema } from '@/types/quotes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const intialFormState = {
  success: false,
};

// This is an example of a form with uncontolled inputs
export default function NewQuotePage() {
  const {
    register,
    formState: { errors },
  } = useForm({ mode: 'onChange', resolver: zodResolver(NewQuoteSchema) });
  const [state, dispatchAction, isPending] = useActionState<
    NewQuoteFormState,
    FormData
  >(handleNewQuote, intialFormState);

  if (isPending) {
    return (
      <div className='flex min-h-full items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (state.success) {
    redirect('/quotes/new/success');
  }


  return (
    <form
      autoComplete='off'
      className={`max-w-3xl mx-auto` }
      action={dispatchAction}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='quote'>Quote</FieldLabel>
          <Input
            type='text'
            id='quote'
            defaultValue={state.data?.quote}
            {...register('quote')}
          />
          {errors?.quote && !state.errors?.fieldErrors?.quote && (
            <FieldError errors={errors?.quote?.message}>
              {errors?.quote?.message}
            </FieldError>
          )}

          {state.errors?.fieldErrors?.quote && (
            <FieldError errors={state.errors?.fieldErrors.quote}>
              {state.errors?.fieldErrors?.quote?.join(', ')}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor='author'>Author</FieldLabel>
          <Input
            type='text'
            id='author'
            defaultValue={state.data?.author}
            {...register('author')}
          />
          {errors?.author && !state.errors?.fieldErrors?.author && (
            <FieldError errors={errors?.author?.message}>
              {errors?.author?.message}
            </FieldError>
          )}
          {state.errors?.fieldErrors?.author && (
            <FieldError errors={state.errors?.fieldErrors.author}>
              {state.errors?.fieldErrors?.author?.join(', ')}
            </FieldError>
          )}
        </Field>

        <Button type='submit'>Save New Quote</Button>
      </FieldGroup>
    </form>
  );
}
