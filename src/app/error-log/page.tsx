import { PageHeader } from "@/components/ui";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function tags(value: string) {
  try {
    return (JSON.parse(value) as string[]).join(", ");
  } catch {
    return "";
  }
}

export default async function ErrorLogPage() {
  const attempts = await getPrisma().attempt.findMany({
    where: { OR: [{ isCorrect: false }, { confidence: { lte: 2 } }, { mistakeTags: { contains: "Got right but unsure" } }] },
    include: { question: { include: { reviewPlan: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Error Log" subtitle="Every missed or uncertain question, with review schedule and history context." />
      <div className="grid gap-4">
        {attempts.map((attempt) => (
          <article key={attempt.id} className="panel p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="chip">{attempt.question.concept}</span>
              <span className="chip">{attempt.question.section}</span>
              <span className="chip">{attempt.question.difficulty}</span>
              <span className="chip">Next review: {attempt.question.reviewPlan?.nextReviewAt.toLocaleDateString() || "not scheduled"}</span>
            </div>
            <h2 className="font-bold">{attempt.question.text}</h2>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-4">
              <div><span className="text-[#8ea0b5]">My answer</span><div>{attempt.selectedAnswer}</div></div>
              <div><span className="text-[#8ea0b5]">Correct</span><div>{attempt.question.correctAnswer}</div></div>
              <div><span className="text-[#8ea0b5]">Time</span><div>{attempt.timeSeconds}s</div></div>
              <div><span className="text-[#8ea0b5]">Confidence</span><div>{attempt.confidence}/5</div></div>
            </div>
            <p className="mt-3 text-sm text-[#c7d2e1]"><b>Mistake tags:</b> {tags(attempt.mistakeTags) || "none"}</p>
            <p className="mt-3 text-sm text-[#c7d2e1]"><b>Explanation:</b> {attempt.question.explanation}</p>
            <p className="mt-3 text-xs text-[#8ea0b5]">
              Review history: stage {attempt.question.reviewPlan?.stageIndex ?? 0}, correct under target streak {attempt.question.reviewPlan?.correctUnderTargetStreak ?? 0}, mastered {attempt.question.reviewPlan?.mastered ? "yes" : "no"}.
            </p>
          </article>
        ))}
        {!attempts.length ? <div className="panel p-6 text-[#8ea0b5]">No missed or uncertain attempts yet.</div> : null}
      </div>
    </>
  );
}
