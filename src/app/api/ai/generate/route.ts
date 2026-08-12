import { difficulties, questionTypes, sections } from "@/lib/constants";
import { jsonError, requireEnum, requireNumber, requireString } from "@/lib/validation";

function buildPrompt(body: Record<string, unknown>) {
  const section = requireEnum(body.section, sections, "Section");
  const type = requireEnum(body.type, questionTypes, "Question type");
  const difficulty = requireEnum(body.difficulty, difficulties, "Difficulty");
  const concept = requireString(body.concept, "Concept");
  const count = Math.min(requireNumber(body.count ?? 3, "Number of questions", 1), 10);
  return `Generate ${count} original GMAT-style selected-response practice questions.

Constraints:
- Section: ${section}
- Question type: ${type}
- Concept: ${concept}
- Difficulty: ${difficulty}
- Five answer choices A-E
- Include correct answer and concise explanation
- Do not use, quote, paraphrase, or imitate copyrighted official GMAT questions.

Return a clean numbered list.`;
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
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.7 }),
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
    return jsonError(error);
  }
}
