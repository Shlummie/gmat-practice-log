import type { Question } from "@prisma/client";

export type QuestionWithStats = Question & {
  attempts: {
    id: number;
    isCorrect: boolean;
    timeSeconds: number;
    confidence: number;
    selectedAnswer: string;
    mistakeTags: string;
    createdAt: Date;
  }[];
  reviewPlan: {
    nextReviewAt: Date;
    mastered: boolean;
    correctUnderTargetStreak: number;
    stageIndex: number;
  } | null;
};

export type ApiState<T> = { data: T | null; error: string | null; loading: boolean };
