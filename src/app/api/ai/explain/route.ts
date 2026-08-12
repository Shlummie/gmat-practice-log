import { mistakeTags } from "@/lib/constants";
import { jsonError, requireString } from "@/lib/validation";

function buildPrompt(body: Record<string, unknown>) {
  const tags = Array.isArray(body.mistakeTags)
    ? body.mistakeTags.filter((tag): tag is string => typeof tag === "string" && mistakeTags.includes(tag as never))
    : [];
  return `You are a GMAT tutor. Use only original reasoning and do not reproduce copyrighted official GMAT material.

Question:
${requireString(body.question, "Question")}

My attempted answer:
${requireString(body.attemptedAnswer, "Attempted answer")}

Correct answer:
${requireString(body.correctAnswer, "Correct answer")}

Mistake tags: ${tags.join(", ") || "none"}

Return exactly this format:
1. What the question is really testing
2. Why my answer was tempting but wrong
3. Fastest correct method
4. Trap pattern
5. Similar original practice question`;
}

async function callOllama(prompt: string, model: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false }),
  });
  if (!response.ok) throw new Error(`Ollama returned ${response.status}.`);
  const data = (await response.json()) as { response?: string };
  return data.response || "";
}

async function callOpenAICompatible(prompt: string, model: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured. Ollama is the default provider.");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI-compatible provider returned ${response.status}.`);
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const prompt = buildPrompt(body);
    const provider = body.provider === "openai" ? "openai" : "ollama";
    const model =
      typeof body.model === "string" && body.model.trim()
        ? body.model.trim()
        : provider === "openai"
          ? process.env.OPENAI_MODEL || "gpt-4o-mini"
          : process.env.OLLAMA_MODEL || "llama3.1";

    const output = provider === "openai" ? await callOpenAICompatible(prompt, model) : await callOllama(prompt, model);
    return Response.json({ output, prompt, model, provider });
  } catch (error) {
    const prompt = error instanceof Error && error.message.includes("required") ? "" : undefined;
    return Response.json(
      {
        error: error instanceof Error ? error.message : "AI request failed.",
        prompt,
      },
      { status: 400 },
    );
  }
}
