import { Output, generateText } from "ai";

import { assertApiKeyConfigured, getOpenAIModel } from "@/lib/ai";
import { requireAdminOr403 } from "@/lib/auth0-utils";
import { PRODUCT_DESCRIPTION_SYSTEM_PROMPT } from "@/lib/prompts";
import {
  productDescriptionRequestSchema,
  productDescriptionResponseSchema,
} from "@/types/product";

export const maxDuration = 60;

// POST /api/ai/products  body: { title: string }  ->  { description: string }
export async function POST(req: Request) {
  // Only admins may spend our AI budget.
  const adminOrResponse = await requireAdminOr403();
  if (adminOrResponse instanceof Response) return adminOrResponse;

  try {
    assertApiKeyConfigured();
  } catch {
    return Response.json(
      { error: "Server is missing OPENAI_API_KEY configuration." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = productDescriptionRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request body.";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    const { output } = await generateText({
      model: getOpenAIModel(),
      output: Output.object({ schema: productDescriptionResponseSchema }),
      system: PRODUCT_DESCRIPTION_SYSTEM_PROMPT,
      prompt: `Product title: ${parsed.data.title}`,
    });

    return Response.json(output);
  } catch (error) {
    console.error("AI product description generation failed", error);
    return Response.json(
      { error: "Could not generate a description. Please try again." },
      { status: 502 },
    );
  }
}
