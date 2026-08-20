import { auth0 } from '@/lib/auth0';
import { getQuotes } from './(require-user)/quotes/action';
import HomeClient from './HomeClient';

export default async function Home() {

  // const quotes = await getQuotes();
  // const session = await auth0.getSession();

  const [quotes, session] = await Promise.all([getQuotes(), auth0.getSession()]);
 

  return (
    <HomeClient initialQuotes={quotes} userId={session?.user?.sub ?? null}/>
  );
}
