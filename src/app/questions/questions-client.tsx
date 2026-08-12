"use client";

import { useEffect, useState } from "react";
import { PageHeader, SelectField } from "@/components/ui";
import { answers, difficulties, label, questionTypes, sections } from "@/lib/constants";

type Question = {
  id: number;
  section: string;
  type: string;
  concept: string;
  difficulty: string;
  text: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  choiceE: string;
  correctAnswer: string;
  explanation: string;
  source: string;
  notes: string | null;
  targetSeconds: number;
};

const blank = {
  section: "QUANT",
  type: "PROBLEM_SOLVING",
  concept: "",
  difficulty: "MEDIUM",
  text: "",
  choiceA: "",
  choiceB: "",
  choiceC: "",
  choiceD: "",
  choiceE: "",
  correctAnswer: "A",
  explanation: "",
  source: "self-made",
  notes: "",
  targetSeconds: 120,
};

export function QuestionsClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState<Record<string, string | number>>(blank);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/questions");
    setQuestions(await response.json());
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/questions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || "Could not save question.");
    setForm(blank);
    setMessage("Question saved.");
    await load();
  }

  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <>
      <PageHeader title="Question Bank" subtitle="Create original questions and maintain the local practice set." />
      <section className="grid gap-4 xl:grid-cols-[440px_1fr]">
        <form onSubmit={submit} className="panel grid gap-3 p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            <SelectField label="Section" name="section" value={String(form.section)} onChange={(v) => set("section", v)} options={sections} />
            <SelectField label="Question type" name="type" value={String(form.type)} onChange={(v) => set("type", v)} options={questionTypes} />
            <label className="grid gap-1 text-sm font-semibold">Concept<input className="field" value={String(form.concept)} onChange={(e) => set("concept", e.target.value)} placeholder="algebra, rates, assumptions" /></label>
            <SelectField label="Difficulty" name="difficulty" value={String(form.difficulty)} onChange={(v) => set("difficulty", v)} options={difficulties} />
          </div>
          <label className="grid gap-1 text-sm font-semibold">Question text<textarea className="field min-h-28" value={String(form.text)} onChange={(e) => set("text", e.target.value)} /></label>
          {answers.map((answer) => (
            <label key={answer} className="grid gap-1 text-sm font-semibold">Choice {answer}<input className="field" value={String(form[`choice${answer}`])} onChange={(e) => set(`choice${answer}`, e.target.value)} /></label>
          ))}
          <div className="grid gap-3 md:grid-cols-2">
            <SelectField label="Correct answer" name="correctAnswer" value={String(form.correctAnswer)} onChange={(v) => set("correctAnswer", v)} options={answers} />
            <label className="grid gap-1 text-sm font-semibold">Target seconds<input className="field" type="number" value={String(form.targetSeconds)} onChange={(e) => set("targetSeconds", e.target.value)} /></label>
          </div>
          <label className="grid gap-1 text-sm font-semibold">Explanation<textarea className="field min-h-24" value={String(form.explanation)} onChange={(e) => set("explanation", e.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">Source<input className="field" value={String(form.source)} onChange={(e) => set("source", e.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">Notes<textarea className="field" value={String(form.notes)} onChange={(e) => set("notes", e.target.value)} /></label>
          <button className="btn btn-primary">Save question</button>
          {message ? <p className="text-sm text-[#8ea0b5]">{message}</p> : null}
        </form>
        <div className="panel overflow-hidden">
          <table className="table">
            <thead><tr><th>Question</th><th>Section</th><th>Concept</th><th>Difficulty</th><th>Answer</th></tr></thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td className="max-w-xl">{question.text}</td>
                  <td>{label(question.section)}</td>
                  <td>{question.concept}</td>
                  <td>{label(question.difficulty)}</td>
                  <td>{question.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
