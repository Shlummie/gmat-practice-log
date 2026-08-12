import { getPrisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const due = await getPrisma().reviewPlan.findMany({
    where: { mastered: false, nextReviewAt: { lte: now } },
    include: { question: { include: { attempts: { orderBy: { createdAt: "desc" }, take: 5 } } } },
    orderBy: { nextReviewAt: "asc" },
  });
  return Response.json(due);
}
