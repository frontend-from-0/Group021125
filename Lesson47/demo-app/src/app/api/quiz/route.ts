import {
  createTextStreamResponse,
  streamText,
  toTextStream,
} from 'ai';

import { assertApiKeyConfigured } from '@/lib/ai';
import { logQuizUsage, parseQuizOutput } from '@/lib/log-usage';
import {
  QUIZ_FUNCTION_ID,
  createQuizGenerationSettings,
} from '@/lib/quiz-generation';
import { quizRequestSchema } from '@/lib/schema';

export const maxDuration = 120;

export async function POST(req: Request) {
  const requestStartedAt = Date.now();

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
    ...createQuizGenerationSettings(topic, questionCount),
    abortSignal: req.signal,
    onError: ({ error }) => {
      console.error(error);
    },
    // onFinish is a v7 alias of onEnd. It receives text, usage, finishReason, and model.
    onFinish: ({ text, usage, finishReason, model }) => {
      const parsedOutput = parseQuizOutput(text);

      logQuizUsage({
        event: 'quiz_generated',
        functionId: QUIZ_FUNCTION_ID,
        model: model.modelId,
        topicLength: topic.length,
        requestedQuestionCount: questionCount,
        questionsReturned: parsedOutput.success
          ? (parsedOutput.data.questions?.length ?? 0)
          : 0,
        usage: {
          input: usage.inputTokens,
          output: usage.outputTokens,
          total: usage.totalTokens,
        },
        durationMs: Date.now() - requestStartedAt,
        finishReason,
        schemaValid: parsedOutput.success,
      });
    },
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
