import {
  Output,
  createTextStreamResponse,
  streamText,
  toTextStream,
} from 'ai';

import { assertApiKeyConfigured, getOpenAIModel } from '@/lib/ai';
import { SESSION_SYSTEM_PROMPT } from '@/lib/prompts';
import { quizRequestSchema, quizResponseSchema } from '@/lib/schema';

export const maxDuration = 120;

// Enough tokens for 15 questions with 4 options and explanations without truncating JSON.
const QUIZ_MAX_OUTPUT_TOKENS = 6000;

export async function POST(req: Request) {
  try {
    assertApiKeyConfigured();
  } catch {
    return Response.json(
      { error: 'Server is missing OPENAI_API_KEY configuration.' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = quizRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? 'Invalid request body.';
    return Response.json({ error: message }, { status: 400 });
  }

  const { topic, questionCount } = parsed.data;

  const result = streamText({
    model: getOpenAIModel(),
    output: Output.object({ schema: quizResponseSchema }),
    instructions: SESSION_SYSTEM_PROMPT,
    prompt: `User topic: ${topic}\nGenerate exactly ${questionCount} questions.`,
    abortSignal: req.signal,
    maxOutputTokens: QUIZ_MAX_OUTPUT_TOKENS,
    onError: ({ error }) => {
      console.error(error);
    },
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
