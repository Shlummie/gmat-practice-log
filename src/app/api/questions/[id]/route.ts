import { getPrisma } from "@/lib/db";
import { jsonError, parseQuestionInput } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const question = await getPrisma().question.findUnique({
    where: { id: Number(id) },
    include: { attempts: { orderBy: { createdAt: "desc" } }, reviewPlan: true },
  });
  if (!question) return jsonError(new Error("Question not found."), 404);
  return Response.json(question);
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const data = parseQuestionInput(body);
    const question = await getPrisma().question.update({ where: { id: Number(id) }, data });
    return Response.json(question);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  await getPrisma().question.delete({ where: { id: Number(id) } });
  return Response.json({ ok: true });
}
