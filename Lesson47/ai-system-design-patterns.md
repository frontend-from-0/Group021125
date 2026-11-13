# AI system design patterns — must know

Call the model from a Next.js server route. Keep the API key off the client. Validate input and output. Do not treat model text as truth or as code.

Recipes: [AI SDK Recipes](https://ai-sdk.dev/resources/recipes) (Next.js section).

---

## 1. Server-side AI gateway / BFF

Your Route Handler is the only place that holds the provider key and talks to OpenAI.

- Never put the key in the browser or in `NEXT_PUBLIC_*`. Never commit it.
- Authenticate first. “Logged in” is not the same as “allowed to generate.”
- Do not let the client choose the model, the system prompt, or tool permissions.
- Validate and cap input in the route. Do not return raw provider errors.

```ts
// app/api/completion/route.ts — server only
const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt,
  maxOutputTokens: 300,
});
```

**Ecom examples**

- `/api/ai/products` is admin-only (`requireAdminOr403`); the browser never sees `OPENAI_API_KEY`.
- Same pattern for alt text, tags, translation, and bulk-cleanup routes — auth in the route, not the button.
- Support chat needs a session; do not expose a public OpenAI proxy.
- Stripe and Prisma stay behind your APIs; the model never gets those keys.

- [Generate Text](https://ai-sdk.dev/resources/recipes/next/generate-text)
- [OpenAI: API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)

---

## 2. Streaming responses

Send tokens (or a partial object) to the UI as they are generated.

- Stream from your route, not from the browser to the provider.
- A streamed object is partial until it finishes — do not save or score it early.
- Handle stream errors (`onError`) and allow cancel (`AbortSignal`).
- Render streamed Markdown with a sanitizing renderer, not `dangerouslySetInnerHTML`.

```ts
const result = streamText({
  model: openai('gpt-4o-mini'),
  messages: await convertToModelMessages(messages),
});
return createUIMessageStreamResponse({
  stream: toUIMessageStream({ stream: result.stream }),
});
```

**Ecom examples**

- Stream the product-description draft into the admin create-product form as it generates.
- Stream SEO meta or a translation so the admin can stop early (`AbortSignal`).
- Stream a review summary or support answer; do not persist until the stream finishes.
- Bulk import cleanup: stream per-row progress; cancel stops spend.

- [Stream Text](https://ai-sdk.dev/resources/recipes/next/stream-text)
- [Stream Text with Chat Prompt](https://ai-sdk.dev/resources/recipes/next/stream-text-with-chat-prompt)
- [Stream Object](https://ai-sdk.dev/resources/recipes/next/stream-object)
- [Markdown Chatbot with Streamdown](https://ai-sdk.dev/resources/recipes/next/markdown-chatbot-with-memoization)

---

## 3. Structured output

Ask for JSON that matches a Zod schema; validate again before use.

- Use `generateText` / `streamText` with `output: Output.object({ schema })` (AI SDK 7). Older posts say `generateObject`.
- A valid schema is not a true or safe answer. Still check business rules (e.g. one correct option).
- Handle `NoObjectGeneratedError`. Cap input length.
- Use structured output when the UI must parse the result (quiz). Plain text is fine when a human will edit it.

```ts
const { output } = await generateText({
  model: openai('gpt-4o-mini'),
  output: Output.object({ schema: quizSchema }),
  prompt: `Create a short quiz about: ${topic}`,
});
```

**Ecom examples**

- “Generate description” returns `{ title, description, bullets, seoTitle, metaDescription, tags }` and fills the form fields.
- Category/tag suggestions as an enum or allow-list; reject unknown categories.
- Image alt text and SEO meta as typed fields, not a Markdown blob.
- Bulk import: structured rows (`sku`, `name`, `price`, `errors`) you can validate against Prisma.

- [Generate Object](https://ai-sdk.dev/resources/recipes/next/generate-object)
- [Stream Object](https://ai-sdk.dev/resources/recipes/next/stream-object)
- [OpenAI: Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)

---

## 4. Human-in-the-loop (HITL)

The model drafts. A person reviews, edits, and approves before anything is saved or sent.

- The generate route returns a draft only. The existing Save path is the only database writer.
- Require approval for tools with side effects (payments, emails, deletes). AI SDK: `needsApproval: true`.
- Show enough context to judge the draft. Log who generated and who approved.
- Do not auto-save or auto-publish model output.

**Ecom examples**

- “Generate description” drafts into the form; the admin reviews/edits; Save writes to Prisma.
- Refund or discount tools need `needsApproval` — confirm before any Stripe or order change.
- Review moderation: the model flags; an admin publishes or removes.
- Translations and alt text go live only after an admin approves.

- [Human-in-the-Loop with Next.js](https://ai-sdk.dev/resources/recipes/next/human-in-the-loop)
- [OpenAI: Safety best practices](https://developers.openai.com/api/docs/guides/safety-best-practices)

---

## 5. Guardrails

Checks around the model: validate input, constrain output, never trust the text.

- Treat all user text as untrusted (topics, product names, chat). Keep the system prompt on the server.
- Cap input length and output tokens. Prompt injection is OWASP LLM01 (2026).
- Never run model output as HTML, SQL, or a shell command. Render as text or sanitized Markdown.
- A schema or a word filter is not security by itself.

**Ecom examples**

- Cap product name/features on `/api/ai/products`. Do not invent prices, certifications, or stock.
- Do not render a generated description or a customer review as raw HTML.
- Support chat: treat messages as untrusted; never leak another user’s order.
- Description, moderation, and translation prompts stay on the server.

- [Markdown Chatbot with Streamdown](https://ai-sdk.dev/resources/recipes/next/markdown-chatbot-with-memoization)
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
- [Fowler / Thoughtworks: Guardrails](https://martinfowler.com/articles/gen-ai-patterns/)

---

## 6. Tool calling and agent loops

The model requests a tool. Your server runs it (or refuses). Repeat only inside a step limit.

- The model does not execute tools. You do. Validate `inputSchema`. Least privilege — no raw SQL/shell.
- Always set `stopWhen: isStepCount(n)`. Unbounded loops burn tokens (OWASP LLM06).
- Prefer a fixed workflow (your code calls the model, then the DB) unless the path is truly unknown.
- Writes need HITL (`needsApproval`). Start simple; a single `generateText` is often enough.

```ts
const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  tools: { getProduct },
  stopWhen: isStepCount(5),
  prompt,
});
```

**Ecom examples**

- Support chatbot: `getOrderStatus` only if the logged-in Auth0 user owns that order.
- Admin draft: a `getProduct` tool supplies catalogue facts — no raw SQL, no invented specs.
- Refund, discount, or “email the customer” tools: `needsApproval: true`.
- Low-stock / sales insights: read-only tools; no auto-reorder and no price changes.

- [Call Tools](https://ai-sdk.dev/resources/recipes/next/call-tools)
- [Call Tools in Multiple Steps](https://ai-sdk.dev/resources/recipes/next/call-tools-multiple-steps)
- [streamText Multi-Step](https://ai-sdk.dev/resources/recipes/next/stream-text-multistep)
- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents)

---

## 7. Retrieval-augmented generation (RAG)

Retrieve relevant chunks from *your* data, then prompt the model with that context.

- Use RAG when the answer must come from your docs/catalogue, not from the model’s training data.
- Retrieved text is untrusted (OWASP LLM09). Cite sources. Say “I don’t know” if context is missing.
- Evaluate retrieval and generation separately. Re-embed when source docs change.
- Users must only retrieve chunks they are allowed to see.

**Ecom examples**

- “Ask about this product” retrieves catalogue facts plus FAQ / return policy, then answers with sources.
- Semantic product search over embeddings of titles and descriptions.
- Admin description draft: retrieve this product’s facts (and approved similar copy) first.
- Support answers come from your policy docs, not from the model’s memory.

- [RAG Agent (Next.js guide)](https://ai-sdk.dev/resources/recipes/guides/rag-chatbot)
- [Chat with PDFs](https://ai-sdk.dev/resources/recipes/next/chat-with-pdf)
- [Embed Text](https://ai-sdk.dev/resources/recipes/node/embed-text)
- [Retrieval Augmented Generation (Node)](https://ai-sdk.dev/resources/recipes/node/retrieval-augmented-generation)

---

## 8. Caching, rate limiting, and cost control

Cap usage. Bound tokens. Do not pay twice for the same work.

- Enforce per-user (or per-IP) limits in your route. Provider limits are org/project-wide.
- Set `maxOutputTokens`. Set a hard spend limit on the provider account; alerts alone do not stop traffic.
- Exact-cache repeated, non-private results. Put user, model, and prompt version in the cache key.
- Semantic cache is easy to get wrong (wrong similar hit → wrong answer). Honour `429` + `Retry-After`.

**Ecom examples**

- Rate-limit `/api/ai/products` per admin; cap `maxOutputTokens` on description and bulk-cleanup jobs.
- Exact-cache approved description, alt text, or SEO for the same unchanged product + prompt version.
- Never cache one customer’s order-status answer as a global result.
- Cache FAQ / return-policy chunks; do not cache unreviewed drafts as live copy.

- [Caching Middleware](https://ai-sdk.dev/resources/recipes/next/caching-middleware)
- [Rate Limiting](https://ai-sdk.dev/docs/advanced/rate-limiting) (docs; no Next.js recipe)
- [OpenAI: Rate limits](https://developers.openai.com/api/docs/guides/rate-limits)

---

## 9. Observability and evals

Log what the model did (tokens, errors, prompt version). Test quality on a fixed example set.

- Tag each call site (`telemetry: { functionId: 'quiz-generator' }`). Log usage. Redact secrets/PII.
- An HTTP 200 can still be a bad quiz. Keep a small eval set and re-run it after every prompt change.
- AI SDK 7: `registerTelemetry` + `telemetry`. Older docs say `experimental_telemetry`.

**Ecom examples**

- Log tokens, model, and admin id for `/api/ai/products` (`functionId: 'product-description'`).
- Small eval set of sample products: required schema fields present, no invented prices.
- Trace support tool calls (order id, user id) and review-moderation decisions.
- Re-run evals after prompt changes for descriptions, SEO, and translations.

- [Track Agent Token Usage](https://ai-sdk.dev/resources/recipes/next/track-agent-token-usage)
- [AI SDK: Telemetry](https://ai-sdk.dev/docs/ai-sdk-core/telemetry)
- [Fowler / Thoughtworks: Evals](https://martinfowler.com/articles/gen-ai-patterns/)

---

## 10. Model router, provider abstraction, and fallbacks

Call models through one interface (the AI SDK). Pick a model per task. Have a backup if the provider fails.

- Centralise model ids. Do not scatter raw vendor client calls across pages.
- Match model to job (a small model is enough for a short quiz or product draft).
- After a fallback, re-check schemas/evals. Do not fail over to a model with more tool power.
- Retry with backoff. A tight retry loop multiplies cost during an outage.

**Ecom examples**

- Use a small model (`gpt-4o-mini`) for description, alt text, and tags; fall back to another tested model on 503 — same schema.
- Route cheaper models for category tags or moderation flags; a stronger model only if a long support answer needs it.
- Do not fail over to a model that may call refund/discount tools if the primary cannot.
- Centralise model ids for every ecom AI route (`/api/ai/products` and later alt text, translation, search).

- [Generate Text](https://ai-sdk.dev/resources/recipes/next/generate-text)
- [Azure: Application design for AI workloads](https://learn.microsoft.com/en-us/azure/well-architected/ai/application-design)

---

## Sources

**Recipes (fetched, 200):** [index](https://ai-sdk.dev/resources/recipes) · links under each pattern above.

**Docs / industry (fetched):**
- https://ai-sdk.dev/docs/ai-sdk-core/telemetry
- https://ai-sdk.dev/docs/advanced/rate-limiting
- https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/safety-best-practices
- https://developers.openai.com/api/docs/guides/rate-limits
- https://www.anthropic.com/research/building-effective-agents
- https://martinfowler.com/articles/gen-ai-patterns/
- https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
- https://learn.microsoft.com/en-us/azure/well-architected/ai/application-design
