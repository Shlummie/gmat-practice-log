export const sections = ["QUANT", "VERBAL", "DATA_INSIGHTS"] as const;
export const questionTypes = [
  "PROBLEM_SOLVING",
  "CRITICAL_REASONING",
  "READING_COMPREHENSION",
  "DATA_SUFFICIENCY",
  "MULTI_SOURCE_REASONING",
  "TABLE_ANALYSIS",
  "GRAPHICS_INTERPRETATION",
  "TWO_PART_ANALYSIS",
] as const;
export const difficulties = ["EASY", "MEDIUM", "HARD"] as const;
export const answers = ["A", "B", "C", "D", "E"] as const;
export const mistakeTags = [
  "Concept gap",
  "Misread",
  "Bad algebra",
  "Bad elimination",
  "Fell for trap",
  "Too slow",
  "Guessed correctly",
  "Got right but unsure",
] as const;

export const reviewOffsetsDays = [0, 1, 3, 7, 14] as const;

export function label(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
