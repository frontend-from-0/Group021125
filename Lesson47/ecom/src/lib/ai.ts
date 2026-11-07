// Server-only helpers for the Vercel AI SDK (https://ai-sdk.dev).
// Import these ONLY from server code (route handlers, server actions) so the
// OPENAI_API_KEY never reaches the browser.
import { createOpenAI } from '@ai-sdk/openai';

export function assertApiKeyConfigured(): void {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
}

export function getOpenAIModel() {
  assertApiKeyConfigured();
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai('gpt-4o-mini');
}
