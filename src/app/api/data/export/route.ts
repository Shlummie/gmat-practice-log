import { getPrisma } from "@/lib/db";

export async function GET() {
  const prisma = getPrisma();
  const [questions, attempts, reviewPlans, mockTests] = await Promise.all([
    prisma.question.findMany(),
    prisma.attempt.findMany(),
    prisma.reviewPlan.findMany(),
    prisma.mockTest.findMany(),
  ]);
  return Response.json({ exportedAt: new Date().toISOString(), questions, attempts, reviewPlans, mockTests });
}
