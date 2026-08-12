"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, SelectField } from "@/components/ui";
import { answers, difficulties, label, mistakeTags, sections } from "@/lib/constants";

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
  targetSeconds: number;
};

export function PracticeClient({ mode, presetQuestions }: { mode: "PRACTICE" | "REVIEW"; presetQuestions?: Question[] }) {
  const [questions, setQuestions] = useState<Question[]>(presetQuestions || []);
  const [section, setSection] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [concept, setConcept] = useState("");
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("A");
  const [confidence, setConfidence] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [error, setError] = useState("");

  const concepts = useMemo(() => [...new Set(questions.map((question) => question.concept))].sort(), [questions]);
  const current = questions[index];

  async function load() {
    const params = new URLSearchParams();
    if (section) params.set("section", section);
    if (difficulty) params.set("difficulty", difficulty);
    if (concept) params.set("concept", concept);
    const response = await fetch(`/api/questions?${params}`);
    const data = await response.json();
    setQuestions(data);
    setIndex(0);
    resetAnswer();
  }

  useEffect(() => {
    if (!presetQuestions) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    setStartedAt(Date.now());
    setResult(null);
  }

  function resetAnswer() {
    setStartedAt(null);
    setSelectedAnswer("A");
    setConfidence(3);
    setSelectedTags([]);
    setResult(null);
    setError("");
  }

  async function submit() {
    if (!current || !startedAt) return;
    setError("");
    const timeSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const response = await fetch("/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId: current.id, selectedAnswer, timeSeconds, confidence, mistakeTags: selectedTags, mode }),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Could not save attempt.");
    setResult({ isCorrect: data.isCorrect, correctAnswer: data.correctAnswer });
  }

  function next() {
    setIndex((value) => Math.min(value + 1, questions.length - 1));
    resetAnswer();
  }

  return (
    <>
      <PageHeader title={mode === "REVIEW" ? "Spaced Reviews" : "Practice Mode"} subtitle="Timed selected-response practice with confidence and mistake tagging." />
      {!presetQuestions ? (
        <div className="panel mb-4 grid gap-3 p-4 md:grid-cols-4">
          <SelectField label="Section" name="section" value={section} onChange={setSection} options={sections} allowAny />
          <label className="grid gap-1 text-sm font-semibold">Concept<select className="field" value={concept} onChange={(e) => setConcept(e.target.value)}><option value="">Any</option>{concepts.map((item) => <option key={item}>{item}</option>)}</select></label>
          <SelectField label="Difficulty" name="difficulty" value={difficulty} onChange={setDifficulty} options={difficulties} allowAny />
          <button className="btn self-end" onClick={load}>Load set</button>
        </div>
      ) : null}

      {!current ? (
        <div className="panel p-6 text-[#8ea0b5]">No questions available for this queue.</div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="panel p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="chip">{index + 1} / {questions.length}</span>
              <span className="chip">{label(current.section)}</span>
              <span className="chip">{label(current.type)}</span>
              <span className="chip">{current.concept}</span>
              <span className="chip">Target {current.targetSeconds}s</span>
            </div>
            <p className="whitespace-pre-wrap text-lg leading-8">{current.text}</p>
            <div className="mt-6 grid gap-3">
              {answers.map((answer) => (
                <label key={answer} className={`flex cursor-pointer gap-3 rounded-md border p-3 ${selectedAnswer === answer ? "border-[#4ade80] bg-[#13241b]" : "border-[#243142] bg-[#0d131b]"}`}>
                  <input type="radio" checked={selectedAnswer === answer} onChange={() => setSelectedAnswer(answer)} />
                  <span><b>{answer}.</b> {current[`choice${answer}` as keyof Question]}</span>
                </label>
              ))}
            </div>
            {result ? (
              <div className={`mt-5 rounded-md border p-4 ${result.isCorrect ? "border-[#2a7e4d] bg-[#102016]" : "border-[#8b2638] bg-[#241019]"}`}>
                <div className="font-bold">{result.isCorrect ? "Correct" : `Incorrect. Correct answer: ${result.correctAnswer}`}</div>
                <p className="mt-2 text-sm text-[#c7d2e1]">{current.explanation}</p>
              </div>
            ) : null}
          </div>
          <aside className="panel grid content-start gap-4 p-4">
            <div>
              <div className="text-sm font-bold">Timer</div>
              <button className="btn btn-primary mt-2 w-full" onClick={start}>{startedAt ? "Restart timer" : "Start timed question"}</button>
            </div>
            <label className="grid gap-2 text-sm font-semibold">Confidence: {confidence}<input type="range" min="1" max="5" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} /></label>
            <div className="grid gap-2">
              <div className="text-sm font-bold">Mistake tags</div>
              {mistakeTags.map((tag) => (
                <label key={tag} className="flex gap-2 text-sm text-[#c7d2e1]">
                  <input type="checkbox" checked={selectedTags.includes(tag)} onChange={(e) => setSelectedTags((currentTags) => e.target.checked ? [...currentTags, tag] : currentTags.filter((item) => item !== tag))} />
                  {tag}
                </label>
              ))}
            </div>
            <button className="btn btn-primary" disabled={!startedAt} onClick={submit}>Submit answer</button>
            <button className="btn" onClick={next}>Next question</button>
            {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
          </aside>
        </section>
      )}
    </>
  );
}
