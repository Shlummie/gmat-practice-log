-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "choiceA" TEXT NOT NULL,
    "choiceB" TEXT NOT NULL,
    "choiceC" TEXT NOT NULL,
    "choiceD" TEXT NOT NULL,
    "choiceE" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'self-made',
    "notes" TEXT,
    "targetSeconds" INTEGER NOT NULL DEFAULT 120,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'PRACTICE',
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeSeconds" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "mistakeTags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "stageIndex" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" DATETIME NOT NULL,
    "correctUnderTargetStreak" INTEGER NOT NULL DEFAULT 0,
    "mastered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReviewPlan_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MockTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "quantScore" INTEGER,
    "quantPercentile" INTEGER,
    "verbalScore" INTEGER,
    "verbalPercentile" INTEGER,
    "dataInsightsScore" INTEGER,
    "dataInsightsPercentile" INTEGER,
    "notes" TEXT,
    "wentWrong" TEXT,
    "drillNext" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewPlan_questionId_key" ON "ReviewPlan"("questionId");
