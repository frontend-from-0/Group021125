import { Output } from 'ai';

import { getOpenAIModel } from './ai';
import { SESSION_SYSTEM_PROMPT } from './prompts';
import { quizResponseSchema } from './schema';

// Enough tokens for 15 questions with 4 options and explanations without truncating JSON.
export const QUIZ_MAX_OUTPUT_TOKENS = 6000;

export const QUIZ_FUNCTION_ID = 'quiz-generator';

export function buildQuizPrompt(topic: string, questionCount: number): string {
  return `User topic: ${topic}\nGenerate exactly ${questionCount} questions.`;
}

/**
 * Shared streamText / generateText settings so the API route and evals
 * always use the same model, schema, instructions, and prompt.
 */
export function createQuizGenerationSettings(
  topic: string,
  questionCount: number,
) {
  return {
    model: getOpenAIModel(),
    output: Output.object({ schema: quizResponseSchema }),
    instructions: SESSION_SYSTEM_PROMPT,
    prompt: buildQuizPrompt(topic, questionCount),
    maxOutputTokens: QUIZ_MAX_OUTPUT_TOKENS,
  };
}
