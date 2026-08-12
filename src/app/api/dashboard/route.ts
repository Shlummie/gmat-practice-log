import { getPrisma } from "@/lib/db";
import { label } from "@/lib/constants";

function pct(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function parseTags(value: string) {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

export async function GET() {
  const prisma = getPrisma();
  const [questions, attempts, reviewPlans, mocks] = await Promise.all([
    prisma.question.findMany({ include: { attempts: true } }),
    prisma.attempt.findMany({ include: { question: true }, orderBy: { createdAt: "desc" } }),
    prisma.reviewPlan.findMany({ where: { mastered: false }, include: { question: true } }),
    prisma.mockTest.findMany({ orderBy: { date: "asc" } }),
  ]);

  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const bySection = ["QUANT", "VERBAL", "DATA_INSIGHTS"].map((section) => {
    const scoped = attempts.filter((attempt) => attempt.question.section === section);
    return { name: label(section), accuracy: pct(scoped.filter((attempt) => attempt.isCorrect).length, scoped.length), attempts: scoped.length };
  });

  const concepts = [...new Set(questions.map((question) => question.concept))].sort();
  const byConcept = concepts.map((concept) => {
    const scoped = attempts.filter((attempt) => attempt.question.concept === concept);
    return { name: concept, accuracy: pct(scoped.filter((attempt) => attempt.isCorrect).length, scoped.length), attempts: scoped.length };
  });

  const tagCounts = new Map<string, number>();
  for (const attempt of attempts) {
    for (const tag of parseTags(attempt.mistakeTags)) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return Response.json({
    totalAttempts: attempts.length,
    overallAccuracy: pct(correct, attempts.length),
    averageTime: attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.timeSeconds, 0) / attempts.length) : 0,
    bySection,
    byConcept,
    weakestConcepts: byConcept.filter((row) => row.attempts > 0).sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts).slice(0, 5),
    mistakeTypes: [...tagCounts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    dueToday: reviewPlans.filter((plan) => plan.nextReviewAt <= todayEnd).length,
    dueReviews: reviewPlans.filter((plan) => plan.nextReviewAt <= todayEnd).slice(0, 8),
    mockTrend: mocks.map((mock) => ({ date: mock.date, score: mock.totalScore })),
    recentAttempts: attempts.slice(0, 8),
  });
}
