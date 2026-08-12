import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    section: "QUANT",
    type: "PROBLEM_SOLVING",
    concept: "algebra",
    difficulty: "EASY",
    text: "If 3x + 7 = 28, what is the value of x?",
    choiceA: "5",
    choiceB: "6",
    choiceC: "7",
    choiceD: "8",
    choiceE: "9",
    correctAnswer: "C",
    explanation: "Subtract 7 from both sides to get 3x = 21, then divide by 3.",
    targetSeconds: 75,
  },
  {
    section: "QUANT",
    type: "PROBLEM_SOLVING",
    concept: "rates",
    difficulty: "MEDIUM",
    text: "A machine fills 18 bottles in 6 minutes. At the same rate, how many bottles can it fill in 25 minutes?",
    choiceA: "60",
    choiceB: "65",
    choiceC: "70",
    choiceD: "75",
    choiceE: "80",
    correctAnswer: "D",
    explanation: "The rate is 3 bottles per minute. In 25 minutes, it fills 75 bottles.",
    targetSeconds: 90,
  },
  {
    section: "QUANT",
    type: "DATA_SUFFICIENCY",
    concept: "number properties",
    difficulty: "MEDIUM",
    text: "Is integer n even? (1) n is divisible by 6. (2) n + 1 is odd.",
    choiceA: "Statement (1) alone is sufficient.",
    choiceB: "Statement (2) alone is sufficient.",
    choiceC: "Both statements together are sufficient, but neither alone is sufficient.",
    choiceD: "Each statement alone is sufficient.",
    choiceE: "Statements together are not sufficient.",
    correctAnswer: "D",
    explanation: "Divisible by 6 implies even. If n + 1 is odd, n is even. Each statement works alone.",
    targetSeconds: 100,
  },
  {
    section: "QUANT",
    type: "PROBLEM_SOLVING",
    concept: "probability",
    difficulty: "HARD",
    text: "A jar has 4 red, 3 blue, and 5 green marbles. If two marbles are chosen without replacement, what is the probability both are blue?",
    choiceA: "1/22",
    choiceB: "1/18",
    choiceC: "1/16",
    choiceD: "1/12",
    choiceE: "1/6",
    correctAnswer: "A",
    explanation: "The probability is (3/12)(2/11) = 6/132 = 1/22.",
    targetSeconds: 135,
  },
  {
    section: "QUANT",
    type: "PROBLEM_SOLVING",
    concept: "geometry",
    difficulty: "MEDIUM",
    text: "A rectangle has perimeter 34 and width 6. What is its area?",
    choiceA: "54",
    choiceB: "60",
    choiceC: "66",
    choiceD: "72",
    choiceE: "84",
    correctAnswer: "C",
    explanation: "2L + 2W = 34, so L + W = 17. With W = 6, L = 11 and area = 66.",
    targetSeconds: 100,
  },
  {
    section: "VERBAL",
    type: "CRITICAL_REASONING",
    concept: "assumptions",
    difficulty: "MEDIUM",
    text: "A city plans to reduce traffic by raising downtown parking fees. Officials argue that higher parking costs will cause many commuters to use public transit. Which assumption is required?",
    choiceA: "Downtown businesses prefer public transit riders.",
    choiceB: "Commuters have a practical public transit alternative.",
    choiceC: "Parking fees have never been raised before.",
    choiceD: "Traffic is worse downtown than in suburbs.",
    choiceE: "The city will use the added revenue for transit.",
    correctAnswer: "B",
    explanation: "The plan depends on commuters being able to switch to transit.",
    targetSeconds: 120,
  },
  {
    section: "VERBAL",
    type: "CRITICAL_REASONING",
    concept: "strengthen",
    difficulty: "HARD",
    text: "A tutoring firm claims its new reading method improves test scores because students using it scored higher after six weeks. Which fact most strengthens the claim?",
    choiceA: "The students also studied math during the period.",
    choiceB: "Students using the old method improved by the same amount.",
    choiceC: "The students were randomly assigned to the new method or the old method.",
    choiceD: "The method uses short daily exercises.",
    choiceE: "Most students liked the instructor.",
    correctAnswer: "C",
    explanation: "Random assignment helps rule out selection effects and makes the comparison stronger.",
    targetSeconds: 135,
  },
  {
    section: "VERBAL",
    type: "READING_COMPREHENSION",
    concept: "main idea",
    difficulty: "EASY",
    text: "Passage: Some firms adopt automation to cut labor costs, but the larger advantage may be consistency. Automated systems can repeat precise actions with fewer variations, which can improve quality even when labor savings are modest. What is the main idea?",
    choiceA: "Automation always eliminates labor costs.",
    choiceB: "Automation's quality benefits can matter as much as cost savings.",
    choiceC: "Firms should avoid automation when savings are modest.",
    choiceD: "Automated systems are too rigid for quality control.",
    choiceE: "Labor costs are the only reason firms automate.",
    correctAnswer: "B",
    explanation: "The passage contrasts cost cutting with a broader consistency and quality benefit.",
    targetSeconds: 110,
  },
  {
    section: "VERBAL",
    type: "READING_COMPREHENSION",
    concept: "inference",
    difficulty: "MEDIUM",
    text: "Passage: A museum increased weekday hours but saw no rise in weekday attendance. Weekend attendance, however, declined slightly. What can be reasonably inferred?",
    choiceA: "The museum's total attendance certainly increased.",
    choiceB: "The new weekday hours did not attract enough visitors to offset all weekend changes.",
    choiceC: "Visitors prefer museums only on weekdays.",
    choiceD: "The museum reduced ticket prices.",
    choiceE: "Weekend hours were eliminated.",
    correctAnswer: "B",
    explanation: "No weekday rise plus weekend decline supports that weekday changes did not compensate for weekend losses.",
    targetSeconds: 120,
  },
  {
    section: "VERBAL",
    type: "CRITICAL_REASONING",
    concept: "weaken",
    difficulty: "MEDIUM",
    text: "A bakery says a new sign increased sales because sales rose 12 percent the week after installation. Which option most weakens the claim?",
    choiceA: "The sign uses bright colors.",
    choiceB: "A large food festival was held next door that same week.",
    choiceC: "The bakery sells coffee.",
    choiceD: "The sign was installed on a Monday.",
    choiceE: "Some customers noticed the sign.",
    correctAnswer: "B",
    explanation: "The festival is an alternate cause for higher sales.",
    targetSeconds: 115,
  },
  {
    section: "DATA_INSIGHTS",
    type: "TABLE_ANALYSIS",
    concept: "tables",
    difficulty: "EASY",
    text: "A table lists product returns: A: 4 of 80, B: 9 of 90, C: 6 of 150. Which product has the highest return rate?",
    choiceA: "A",
    choiceB: "B",
    choiceC: "C",
    choiceD: "A and C tie",
    choiceE: "All tie",
    correctAnswer: "B",
    explanation: "Return rates are A 5%, B 10%, and C 4%.",
    targetSeconds: 105,
  },
  {
    section: "DATA_INSIGHTS",
    type: "GRAPHICS_INTERPRETATION",
    concept: "percent change",
    difficulty: "MEDIUM",
    text: "A chart shows revenue rising from 40 to 50 and costs rising from 25 to 35. Which changed by the larger percentage?",
    choiceA: "Revenue",
    choiceB: "Costs",
    choiceC: "Both changed by the same percentage",
    choiceD: "Neither changed",
    choiceE: "Cannot be determined",
    correctAnswer: "B",
    explanation: "Revenue rose 25%; costs rose 40%.",
    targetSeconds: 120,
  },
  {
    section: "DATA_INSIGHTS",
    type: "TWO_PART_ANALYSIS",
    concept: "optimization",
    difficulty: "HARD",
    text: "A subscription costs $12 monthly plus $0.08 per message. Another costs $20 monthly plus $0.04 per message. At what number of messages are the plans equal, and which plan is cheaper above that number?",
    choiceA: "100 messages; first plan",
    choiceB: "100 messages; second plan",
    choiceC: "200 messages; first plan",
    choiceD: "200 messages; second plan",
    choiceE: "400 messages; second plan",
    correctAnswer: "D",
    explanation: "12 + .08m = 20 + .04m, so .04m = 8 and m = 200. Above 200, the lower variable-cost second plan is cheaper.",
    targetSeconds: 150,
  },
  {
    section: "DATA_INSIGHTS",
    type: "MULTI_SOURCE_REASONING",
    concept: "source reconciliation",
    difficulty: "MEDIUM",
    text: "Source 1 says Store X had 1,200 visits and 96 purchases. Source 2 says Store Y had 900 visits and 81 purchases. Which store had the higher conversion rate?",
    choiceA: "Store X",
    choiceB: "Store Y",
    choiceC: "They are equal",
    choiceD: "Cannot be determined without revenue",
    choiceE: "Cannot be determined without returns",
    correctAnswer: "B",
    explanation: "X conversion is 8%; Y conversion is 9%.",
    targetSeconds: 120,
  },
  {
    section: "DATA_INSIGHTS",
    type: "TABLE_ANALYSIS",
    concept: "weighted averages",
    difficulty: "HARD",
    text: "A class has 10 students averaging 80 and 20 students averaging 92. What is the combined average?",
    choiceA: "84",
    choiceB: "86",
    choiceC: "88",
    choiceD: "90",
    choiceE: "91",
    correctAnswer: "C",
    explanation: "Weighted average = (10*80 + 20*92) / 30 = 2640 / 30 = 88.",
    targetSeconds: 120,
  },
] as const;

async function main() {
  await prisma.attempt.deleteMany();
  await prisma.reviewPlan.deleteMany();
  await prisma.mockTest.deleteMany();
  await prisma.question.deleteMany();

  for (const question of questions) {
    await prisma.question.create({ data: { ...question, source: "self-made seed" } });
  }

  const created = await prisma.question.findMany({ take: 5, orderBy: { id: "asc" } });
  const attempts = [
    { questionId: created[0].id, selectedAnswer: "C", isCorrect: true, timeSeconds: 54, confidence: 5, mistakeTags: "[]" },
    { questionId: created[1].id, selectedAnswer: "C", isCorrect: false, timeSeconds: 142, confidence: 2, mistakeTags: JSON.stringify(["Too slow", "Bad algebra"]) },
    { questionId: created[2].id, selectedAnswer: "A", isCorrect: false, timeSeconds: 118, confidence: 3, mistakeTags: JSON.stringify(["Concept gap"]) },
    { questionId: created[3].id, selectedAnswer: "A", isCorrect: true, timeSeconds: 156, confidence: 2, mistakeTags: JSON.stringify(["Got right but unsure"]) },
    { questionId: created[4].id, selectedAnswer: "D", isCorrect: false, timeSeconds: 91, confidence: 4, mistakeTags: JSON.stringify(["Misread"]) },
  ] as const;

  for (const attempt of attempts) {
    await prisma.attempt.create({ data: attempt });
  }

  const now = new Date();
  for (const question of created.slice(1, 5)) {
    await prisma.reviewPlan.create({
      data: { questionId: question.id, nextReviewAt: now, stageIndex: 0 },
    });
  }

  await prisma.mockTest.createMany({
    data: [
      {
        date: new Date("2026-06-01"),
        totalScore: 575,
        quantScore: 79,
        quantPercentile: 55,
        verbalScore: 80,
        verbalPercentile: 58,
        dataInsightsScore: 78,
        dataInsightsPercentile: 49,
        notes: "Baseline diagnostic with pacing issues.",
        wentWrong: "Rushed DI tables and missed quant setup details.",
        drillNext: "Rates, table analysis, assumption questions.",
      },
      {
        date: new Date("2026-06-15"),
        totalScore: 615,
        quantScore: 82,
        quantPercentile: 68,
        verbalScore: 81,
        verbalPercentile: 63,
        dataInsightsScore: 80,
        dataInsightsPercentile: 60,
        notes: "Better pacing, still too slow on hard probability.",
        wentWrong: "Second-guessed CR answers.",
        drillNext: "Probability and CR strengthen/weaken.",
      },
    ],
  });

  console.log(`Seeded ${questions.length} original sample questions.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
