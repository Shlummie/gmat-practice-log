import type { Prisma } from "@prisma/client";

import { getPrisma } from "@/lib/db";
import { difficulties, sections } from "@/lib/constants";
import { jsonError, parseQuestionInput, requireEnum } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const difficulty = searchParams.get("difficulty");
    const concept = searchParams.get("concept")?.trim();
    const where: Prisma.QuestionWhereInput = {
      ...(section ? { section: requireEnum(section, sections, "Section") } : {}),
      ...(difficulty
        ? { difficulty: requireEnum(difficulty, difficulties, "Difficulty") }
        : {}),
      ...(concept ? { concept } : {}),
    };

    const questions = await prisma.question.findMany({
      where,
      include: { attempts: { orderBy: { createdAt: "desc" }, take: 5 }, reviewPlan: true },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(questions);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseQuestionInput(body);
    const question = await getPrisma().question.create({ data });
    return Response.json(question, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
