import { getPrisma } from "@/lib/db";
import { jsonError } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prisma = getPrisma();
    await prisma.$transaction(async (tx) => {
      await tx.attempt.deleteMany();
      await tx.reviewPlan.deleteMany();
      await tx.mockTest.deleteMany();
      await tx.question.deleteMany();

      if (Array.isArray(body.questions)) {
        for (const item of body.questions) {
          const { id: _id, createdAt, updatedAt, ...question } = item;
          await tx.question.create({ data: { ...question, createdAt: new Date(createdAt), updatedAt: new Date(updatedAt) } });
        }
      }
      if (Array.isArray(body.attempts)) {
        for (const item of body.attempts) {
          const { id: _id, createdAt, ...attempt } = item;
          await tx.attempt.create({ data: { ...attempt, createdAt: new Date(createdAt) } });
        }
      }
      if (Array.isArray(body.reviewPlans)) {
        for (const item of body.reviewPlans) {
          const { id: _id, createdAt, updatedAt, nextReviewAt, ...plan } = item;
          await tx.reviewPlan.create({
            data: { ...plan, nextReviewAt: new Date(nextReviewAt), createdAt: new Date(createdAt), updatedAt: new Date(updatedAt) },
          });
        }
      }
      if (Array.isArray(body.mockTests)) {
        for (const item of body.mockTests) {
          const { id: _id, createdAt, updatedAt, date, ...mock } = item;
          await tx.mockTest.create({ data: { ...mock, date: new Date(date), createdAt: new Date(createdAt), updatedAt: new Date(updatedAt) } });
        }
      }
    });
    return Response.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
