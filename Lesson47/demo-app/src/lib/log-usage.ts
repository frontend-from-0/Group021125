import { quizResponseSchema } from './schema';

export type QuizUsageLog = {
  event: 'quiz_generated';
  functionId: 'quiz-generator';
  model: string;
  topicLength: number;
  requestedQuestionCount: number;
  questionsReturned: number;
  usage: {
    input: number | undefined;
    output: number | undefined;
    total: number | undefined;
  };
  durationMs: number;
  finishReason: string;
  schemaValid: boolean;
};

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Parse the model text against the quiz schema without throwing. */
export function parseQuizOutput(text: string) {
  return quizResponseSchema.safeParse(parseJson(text));
}

export function logQuizUsage(entry: QuizUsageLog): void {
  console.log(JSON.stringify(entry));
}
