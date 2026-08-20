'use server'

import { listAllQuotes } from '@/repositories/quotes';

export async function getQuotes () {
  return listAllQuotes();
}

export async function getFavouriteQuotes() {
  // check auth and get userid
  // call db proving userId listFavouriteQuotes()
  // return result
}