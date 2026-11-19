# Lesson 47 – AI-powered Next.js application (AI model integration) — INSTRUCTOR NOTES

Group021125 · Fri 13 Nov 2026, 18:30–20:00 Europe/Malta (20:30 TR)
Historical source: Group200825 Lesson46 (19 Aug 2026, same topic): starter 6d0e726/48c8c8c → completed ad16bb3.
(Group130625 Lesson47, 1 Jun 2026, same topic: demo-app only, completed-only commit 7269584.)

## Starter (student PR) contains
- `Lesson47/demo-app` – Live Quiz App from Group200825 L46 (complete, AI SDK v7: `streamText` + `Output.object`, `useObject`).
- `Lesson47/ecom` – copy of Lesson45/ecom + plumbing: `ai` + `@ai-sdk/openai` deps (lockfile updated),
  `OPENAI_API_KEY` in `.env.example`, server-only `src/lib/ai.ts` (`getOpenAIModel`, `assertApiKeyConfigured`).
- `Lesson47/README.md` – student overview.

## Lesson flow (~90 min)
1. (10') What "AI integration" means for a web app: the model is just another API; call it from the server,
   never ship the key to the browser; cost/latency/rate limits; structured output vs free text.
2. (25') Walk through `demo-app`:
   - `src/lib/ai.ts` provider helpers (OpenAI / Anthropic / Perplexity) – swapping providers = 1 line.
   - `src/lib/prompts.ts` system prompt; `src/lib/schema.ts` Zod schemas = contract for the model output.
   - `src/app/api/quiz/route.ts`: validate body → `streamText({ model, output: Output.object({ schema }), instructions, prompt })`
     → `createTextStreamResponse`.
   - `QuizPage.tsx`: `useObject` from `@ai-sdk/react` renders partial objects while streaming.
   - Live change: add `.max(50, …)` to the topic in `quizRequestSchema` (in instructor branch) – show
     the 400 error path and why we limit user input that goes into prompts (cost, prompt injection).
   - Optional: `console.log(result.stream)` in the route to show what the stream is (as done historically).
3. (45') Build in `ecom`: "Generate description with AI" on admin → Products → New.
   - `src/types/product.ts`: `productDescriptionRequestSchema` / `productDescriptionResponseSchema`.
   - `src/lib/prompts.ts`: `PRODUCT_DESCRIPTION_SYSTEM_PROMPT`.
   - `src/app/api/ai/products/route.ts`: `requireAdminOr403()` → validate → `await generateText({ output: Output.object(...) })`
     → `Response.json(output)`; 500 when key missing, 502 on model error.
   - `src/lib/ai-client.ts`: browser `fetch('/api/ai/products')` helper (separate file so server code/keys are never imported client-side).
   - `create-product-form.tsx`: `useRef` on name input + description textarea (uncontrolled form), `type="button"`
     so it doesn't submit the form, loading + error state.
4. (10') Wrap-up & homework.

## Pitfalls seen in the historical lesson (fixed in instructor branch)
- Client fetched `/api/ai` while the route was `/api/ai/products` → 404.
- `generateText` not awaited and route returned `output` instead of a `Response`.
- Server helper (`getOpenAIModel`) and client fetch helper lived in the same `lib/ai.ts` imported by a client component → split.
- Button inside the form without `type="button"` submitted the form.
- Reused the quiz `SESSION_SYSTEM_PROMPT` – ecom needs its own prompt.
- Route was not protected – anyone could spend the API budget; now admin-only.

## Setup checks before class
- Have a working `OPENAI_API_KEY` in `Lesson47/ecom/.env` and `Lesson47/demo-app/.env.local` (gpt-4o-mini).
- Node ≥ 22 for demo-app (`engines`), `npm install` in both projects.
- Note: `npx tsc --noEmit` in ecom shows 3 pre-existing errors from Lesson45 (`action.ts` return/productId+priceId,
  `api/checkout/route.ts` importing `getSessionUser` from `@/lib/auth0`); none in the Lesson 47 files. `next dev` still runs.

## Homework idea (historical demo-app note.md had sample quiz prompts)
- Add "Generate description" to the Edit product page too, or let the admin choose a tone (friendly / technical) passed in the prompt.
- Sample quiz topics to try in demo-app: "useRef vs useState", "forwarding refs to child components".
