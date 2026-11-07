# Lesson 47 – AI-powered Next.js application (AI model integration)

This lesson has two projects:

## 1. `demo-app` – Live Quiz App (walkthrough)
A finished micro-learning quiz app built with the [Vercel AI SDK](https://ai-sdk.dev)
(`streamText` + `Output.object` on the server, `useObject` on the client).
We will read through it together to see how an AI model is called from a Next.js
route handler and how structured (schema-validated) output is streamed to the UI.

```bash
cd Lesson47/demo-app
npm install
cp .env.example .env.local   # add your OPENAI_API_KEY
npm run dev
```

## 2. `ecom` – add AI to our e-commerce app (in class)
This is our e-commerce project from Lesson 45. It is already prepared for the lesson:

- `ai` and `@ai-sdk/openai` are added to `package.json` (run `npm install`)
- `OPENAI_API_KEY` is added to `.env.example` – add your key to your `.env`
- `src/lib/ai.ts` contains server-only helpers (`getOpenAIModel`, `assertApiKeyConfigured`)

In class we will build an **"Generate description"** button on the admin
*Create product* form that asks an AI model to write a product description
based on the product name.

> Never expose your API key in client components – call the model only from server code.
