"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";

type Mock = {
  id: number;
  date: string;
  totalScore: number;
  quantScore: number | null;
  quantPercentile: number | null;
  verbalScore: number | null;
  verbalPercentile: number | null;
  dataInsightsScore: number | null;
  dataInsightsPercentile: number | null;
  notes: string | null;
  wentWrong: string | null;
  drillNext: string | null;
};

const blank = { date: new Date().toISOString().slice(0, 10), totalScore: "", quantScore: "", quantPercentile: "", verbalScore: "", verbalPercentile: "", dataInsightsScore: "", dataInsightsPercentile: "", notes: "", wentWrong: "", drillNext: "" };

export function MocksClient() {
  const [mocks, setMocks] = useState<Mock[]>([]);
  const [form, setForm] = useState<Record<string, string>>(blank);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/mocks");
    setMocks(await response.json());
  }
  useEffect(() => { void load(); }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/mocks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Could not save mock.");
    setForm(blank);
    setMessage("Mock saved.");
    await load();
  }

  return (
    <>
      <PageHeader title="Mock Test Tracker" subtitle="Enter practice exam results and keep an honest trend line." />
      <section className="grid gap-4 xl:grid-cols-[400px_1fr]">
        <form className="panel grid gap-3 p-4" onSubmit={submit}>
          {["date", "totalScore", "quantScore", "quantPercentile", "verbalScore", "verbalPercentile", "dataInsightsScore", "dataInsightsPercentile"].map((key) => (
            <label key={key} className="grid gap-1 text-sm font-semibold">{key}<input className="field" type={key === "date" ? "date" : "number"} value={form[key]} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} /></label>
          ))}
          {["notes", "wentWrong", "drillNext"].map((key) => (
            <label key={key} className="grid gap-1 text-sm font-semibold">{key}<textarea className="field" value={form[key]} onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))} /></label>
          ))}
          <button className="btn btn-primary">Save mock</button>
          {message ? <p className="text-sm text-[#8ea0b5]">{message}</p> : null}
        </form>
        <div className="grid gap-4">
          <div className="panel p-4">
            <h2 className="mb-4 font-bold">Score trend</h2>
            <div className="flex h-52 items-end gap-3 border-b border-l border-[#243142] p-3">
              {[...mocks].reverse().map((mock) => (
                <div key={mock.id} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-[#60a5fa]" style={{ height: `${Math.max(8, (mock.totalScore / 805) * 175)}px` }} />
                  <span className="text-xs text-[#8ea0b5]">{mock.totalScore}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel overflow-hidden">
            <table className="table">
              <thead><tr><th>Date</th><th>Total</th><th>Q</th><th>V</th><th>DI</th><th>Drill next</th></tr></thead>
              <tbody>{mocks.map((mock) => (
                <tr key={mock.id}>
                  <td>{new Date(mock.date).toLocaleDateString()}</td>
                  <td>{mock.totalScore}</td>
                  <td>{mock.quantScore ?? "—"} / {mock.quantPercentile ?? "—"}%</td>
                  <td>{mock.verbalScore ?? "—"} / {mock.verbalPercentile ?? "—"}%</td>
                  <td>{mock.dataInsightsScore ?? "—"} / {mock.dataInsightsPercentile ?? "—"}%</td>
                  <td>{mock.drillNext}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
