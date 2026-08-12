import { answers, mistakeTags } from "@/lib/constants";
import { getPrisma } from "@/lib/db";
import { isUnsure, reviewDateForStage } from "@/lib/review";
import { jsonError, requireEnum, requireNumber } from "@/lib/validation";

export async function GET() {
  const attempts = await getPrisma().attempt.findMany({
    include: { question: { include: { reviewPlan: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(attempts);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const questionId = requireNumber(body.questionId, "Question", 1);
    const selectedAnswer = requireEnum(body.selectedAnswer, answers, "Selected answer");
    const timeSeconds = requireNumber(body.timeSeconds, "Time", 0);
    const confidence = requireNumber(body.confidence, "Confidence", 1);
    const tags = Array.isArray(body.mistakeTags)
      ? body.mistakeTags.filter((tag): tag is string => typeof tag === "string" && mistakeTags.includes(tag as never))
      : [];
    const mode = body.mode === "REVIEW" ? "REVIEW" : "PRACTICE";
    const prisma = getPrisma();
    const question = await prisma.question.findUnique({ where: { id: questionId }, include: { reviewPlan: true } });
    if (!question) throw new Error("Question not found.");
    const isCorrect = question.correctAnswer === selectedAnswer;
    const attempt = await prisma.attempt.create({
      data: { questionId, selectedAnswer, isCorrect, timeSeconds, confidence, mistakeTags: JSON.stringify(tags), mode },
    });

    const uncertain = !isCorrect || isUnsure(confidence, tags);
    if (uncertain) {
      await prisma.reviewPlan.upsert({
        where: { questionId },
        create: {
          questionId,
          stageIndex: 0,
          nextReviewAt: reviewDateForStage(0),
          correctUnderTargetStreak: 0,
          mastered: false,
        },
        update: {
          stageIndex: 0,
          nextReviewAt: reviewDateForStage(0),
          correctUnderTargetStreak: 0,
          mastered: false,
        },
      });
    } else if (mode === "REVIEW" && question.reviewPlan) {
      const underTarget = timeSeconds <= question.targetSeconds;
      const nextStreak = underTarget ? question.reviewPlan.correctUnderTargetStreak + 1 : 0;
      const mastered = nextStreak >= 2;
      const nextStage = Math.min(question.reviewPlan.stageIndex + 1, 4);
      await prisma.reviewPlan.update({
        where: { questionId },
        data: {
          correctUnderTargetStreak: nextStreak,
          mastered,
          stageIndex: nextStage,
          nextReviewAt: mastered ? question.reviewPlan.nextReviewAt : reviewDateForStage(nextStage),
        },
      });
    }

    return Response.json({ attempt, isCorrect, correctAnswer: question.correctAnswer }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
