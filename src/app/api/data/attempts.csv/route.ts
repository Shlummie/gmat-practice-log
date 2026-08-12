import { getPrisma } from "@/lib/db";

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const attempts = await getPrisma().attempt.findMany({
    include: { question: true },
    orderBy: { createdAt: "desc" },
  });
  const rows = [
    ["date", "section", "type", "concept", "difficulty", "question", "selectedAnswer", "correctAnswer", "isCorrect", "timeSeconds", "confidence", "mistakeTags"],
    ...attempts.map((attempt) => [
      attempt.createdAt.toISOString(),
      attempt.question.section,
      attempt.question.type,
      attempt.question.concept,
      attempt.question.difficulty,
      attempt.question.text,
      attempt.selectedAnswer,
      attempt.question.correctAnswer,
      attempt.isCorrect,
      attempt.timeSeconds,
      attempt.confidence,
      attempt.mistakeTags,
    ]),
  ];
  return new Response(rows.map((row) => row.map(escapeCsv).join(",")).join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="gmat-attempts.csv"',
    },
  });
}
