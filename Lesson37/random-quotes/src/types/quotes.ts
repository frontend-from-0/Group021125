import * as z from 'zod';

export interface NewQuoteFormState {
  success: boolean;
  data?: {
    author?: string;
    quote?: string;
  };
  errors?: {
    fieldErrors: {
      author?: string[];
      quote?: string[];
    };
  };
  message?: string;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  likedBy: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}


export const NewQuoteSchema = z.object({
  quote: z
    .string()
    .trim()
    .min(3, 'Minimum quote length should be 3 characters.')
    .max(500, 'The quote is too long, try another quote below 500 chars.'),
  author: z
    .string()
    .trim()
    .min(1, 'Minimum author name length should be 1 character.')
    .max(50, 'The author is too long, maximum allowed length is 50 chars.'),
});
