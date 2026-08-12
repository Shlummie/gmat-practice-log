import { PageHeader, StatCard } from "@/components/ui";
import { getPrisma } from "@/lib/db";
import { label } from "@/lib/constants";

export const dynamic = "force-dynamic";

function pct(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function tags(value: string) {
  try {
    return JSON.parse(value) as string[];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const prisma = getPrisma();
  const [attempts, questions, reviewPlans, mocks] = await Promise.all([
    prisma.attempt.findMany({ include: { question: true }, orderBy: { createdAt: "desc" } }),
    prisma.question.findMany(),
    prisma.reviewPlan.findMany({ where: { mastered: false }, include: { question: true }, orderBy: { nextReviewAt: "asc" } }),
    prisma.mockTest.findMany({ orderBy: { date: "asc" } }),
  ]);
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const averageTime = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.timeSeconds, 0) / attempts.length) : 0;
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const dueToday = reviewPlans.filter((plan) => plan.nextReviewAt <= todayEnd);
  const bySection = ["QUANT", "VERBAL", "DATA_INSIGHTS"].map((section) => {
    const scoped = attempts.filter((attempt) => attempt.question.section === section);
    return { name: label(section), accuracy: pct(scoped.filter((attempt) => attempt.isCorrect).length, scoped.length), attempts: scoped.length };
  });
  const byConcept = [...new Set(questions.map((question) => question.concept))].map((concept) => {
    const scoped = attempts.filter((attempt) => attempt.question.concept === concept);
    return { name: concept, accuracy: pct(scoped.filter((attempt) => attempt.isCorrect).length, scoped.length), attempts: scoped.length };
  });
  const weakest = byConcept.filter((row) => row.attempts > 0).sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts).slice(0, 5);
  const tagCounts = new Map<string, number>();
  attempts.forEach((attempt) => tags(attempt.mistakeTags).forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)));
  const mistakeRows = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="A focused read on accuracy, pacing, weak concepts, and today’s review load." />
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Overall accuracy" value={`${pct(correct, attempts.length)}%`} detail={`${correct}/${attempts.length} attempts correct`} />
        <StatCard label="Average time" value={`${averageTime}s`} detail="All saved attempts" />
        <StatCard label="Due today" value={dueToday.length} detail="Missed or uncertain questions" />
        <StatCard label="Mock trend" value={mocks.at(-1)?.totalScore ?? "—"} detail={mocks.length ? "Latest total score" : "No mocks logged"} />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-4">
          <h2 className="mb-4 font-bold">Accuracy by section</h2>
          <div className="grid gap-4">
            {bySection.map((row) => (
              <div key={row.name} className="grid gap-2">
                <div className="flex justify-between text-sm">
                  <span>{row.name}</span>
                  <span className="text-[#8ea0b5]">{row.accuracy}% · {row.attempts} attempts</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${row.accuracy}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <h2 className="mb-4 font-bold">Weakest 5 concepts</h2>
          <div className="grid gap-3">
            {weakest.length ? weakest.map((row, index) => (
              <div key={row.name} className="flex items-center justify-between border-b border-[#243142] pb-2 last:border-0">
                <span><span className="text-[#8ea0b5]">{index + 1}.</span> {row.name}</span>
                <span className="text-sm text-[#f59e0b]">{row.accuracy}%</span>
              </div>
            )) : <p className="text-sm text-[#8ea0b5]">Complete practice attempts to populate weak concepts.</p>}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="panel p-4">
          <h2 className="mb-4 font-bold">Common mistake types</h2>
          {mistakeRows.length ? mistakeRows.map(([name, count]) => (
            <div key={name} className="mb-3 grid gap-1">
              <div className="flex justify-between text-sm"><span>{name}</span><span>{count}</span></div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, count * 20)}%` }} /></div>
            </div>
          )) : <p className="text-sm text-[#8ea0b5]">Mistake tags will appear here.</p>}
        </div>
        <div className="panel p-4">
          <h2 className="mb-4 font-bold">Recent mock test trend</h2>
          <div className="flex h-44 items-end gap-3 border-b border-l border-[#243142] p-3">
            {mocks.map((mock) => (
              <div key={mock.id} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-[#4ade80]" style={{ height: `${Math.max(8, (mock.totalScore / 805) * 150)}px` }} />
                <span className="text-xs text-[#8ea0b5]">{mock.totalScore}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <h2 className="mb-4 font-bold">Due review queue</h2>
          <div className="grid gap-3">
            {dueToday.slice(0, 5).map((plan) => (
              <div key={plan.id} className="rounded-md bg-[#0d131b] p-3">
                <div className="font-semibold">{plan.question.concept}</div>
                <div className="line-clamp-2 text-sm text-[#8ea0b5]">{plan.question.text}</div>
              </div>
            ))}
            {!dueToday.length ? <p className="text-sm text-[#8ea0b5]">Nothing due today.</p> : null}
          </div>
        </div>
      </section>
    </>
  );
}
