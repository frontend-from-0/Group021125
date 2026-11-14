// Browser-side helper: calls our own API route (never the AI provider directly),
// so the OPENAI_API_KEY stays on the server.
export async function generateProductDescription(title: string): Promise<string> {
  const response = await fetch("/api/ai/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    description?: string;
    error?: string;
  };

  if (!response.ok || !data.description) {
    throw new Error(data.error ?? `Failed to generate product description (${response.status})`);
  }

  return data.description;
}
