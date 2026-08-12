import { getPrisma } from "@/lib/db";
import { jsonError, optionalString, requireNumber } from "@/lib/validation";

export async function GET() {
  const mocks = await getPrisma().mockTest.findMany({ orderBy: { date: "desc" } });
  return Response.json(mocks);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const dateValue = typeof body.date === "string" ? new Date(body.date) : new Date();
    if (Number.isNaN(dateValue.getTime())) throw new Error("Date is invalid.");
    const numberOrNull = (value: unknown, field: string) => (value === "" || value == null ? null : requireNumber(value, field, 0));
    const mock = await getPrisma().mockTest.create({
      data: {
        date: dateValue,
        totalScore: requireNumber(body.totalScore, "Total score", 0),
        quantScore: numberOrNull(body.quantScore, "Quant score"),
        quantPercentile: numberOrNull(body.quantPercentile, "Quant percentile"),
        verbalScore: numberOrNull(body.verbalScore, "Verbal score"),
        verbalPercentile: numberOrNull(body.verbalPercentile, "Verbal percentile"),
        dataInsightsScore: numberOrNull(body.dataInsightsScore, "Data Insights score"),
        dataInsightsPercentile: numberOrNull(body.dataInsightsPercentile, "Data Insights percentile"),
        notes: optionalString(body.notes),
        wentWrong: optionalString(body.wentWrong),
        drillNext: optionalString(body.drillNext),
      },
    });
    return Response.json(mock, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
