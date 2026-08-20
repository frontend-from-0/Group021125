import type { ObjectId } from 'mongodb';

export interface QuoteDocument {
  _id: ObjectId;
  quote: string;
  author: string;
  likedBy: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
