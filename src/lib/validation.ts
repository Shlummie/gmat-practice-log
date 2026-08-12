import { answers, difficulties, questionTypes, sections } from "./constants";

export function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

export function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function requireEnum<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new Error(`${field} is invalid.`);
  }
  return value as T[number];
}

export function requireNumber(value: unknown, field: string, min = 0) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min) {
    throw new Error(`${field} must be at least ${min}.`);
  }
  return Math.round(number);
}

export function parseQuestionInput(body: Record<string, unknown>) {
  return {
    section: requireEnum(body.section, sections, "Section"),
    type: requireEnum(body.type, questionTypes, "Question type"),
    concept: requireString(body.concept, "Concept"),
    difficulty: requireEnum(body.difficulty, difficulties, "Difficulty"),
    text: requireString(body.text, "Question text"),
    choiceA: requireString(body.choiceA, "Choice A"),
    choiceB: requireString(body.choiceB, "Choice B"),
    choiceC: requireString(body.choiceC, "Choice C"),
    choiceD: requireString(body.choiceD, "Choice D"),
    choiceE: requireString(body.choiceE, "Choice E"),
    correctAnswer: requireEnum(body.correctAnswer, answers, "Correct answer"),
    explanation: requireString(body.explanation, "Explanation"),
    source: typeof body.source === "string" && body.source.trim() ? body.source.trim() : "self-made",
    notes: optionalString(body.notes),
    targetSeconds: requireNumber(body.targetSeconds ?? 120, "Target seconds", 15),
  };
}

export function jsonError(error: unknown, status = 400) {
  return Response.json(
    { error: error instanceof Error ? error.message : "Unexpected error." },
    { status },
  );
}
