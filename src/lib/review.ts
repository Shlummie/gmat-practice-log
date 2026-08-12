import { reviewOffsetsDays } from "./constants";

export function reviewDateForStage(stageIndex: number) {
  const offset = reviewOffsetsDays[Math.min(stageIndex, reviewOffsetsDays.length - 1)];
  const date = new Date();
  date.setHours(23, 59, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

export function isUnsure(confidence: number, mistakeTags: string[]) {
  return confidence <= 2 || mistakeTags.includes("Got right but unsure") || mistakeTags.includes("Guessed correctly");
}
