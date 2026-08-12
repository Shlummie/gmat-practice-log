"use client";

import { useState } from "react";
import { PageHeader, SelectField } from "@/components/ui";
import { difficulties, label, mistakeTags, questionTypes, sections } from "@/lib/constants";

export function AiClient() {
  const [provider, setProvider] = useState("ollama");
  const [model, setModel] = useState("llama3.1");
  const [question, setQuestion] = useState("");
  const [attemptedAnswer, setAttemptedAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [generator, setGenerator] = useState({ section: "QUANT", type: "PROBLEM_SOLVING", concept: "algebra", difficulty: "MEDIUM", count: "3" });

  async function run(path: string, body: Record<string, unknown>) {
    setError("");
    setOutput("");
    setPrompt("");
    const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, provider, model }) });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "AI request failed. If Ollama is not running, copy the prompt and run it manually.");
      if (data.prompt) setPrompt(data.prompt);
      return;
    }
    setOutput(data.output);
    setPrompt(data.prompt);
  }

  return (
    <>
      <PageHeader title="AI Assistant" subtitle="Optional local Ollama workflow. OpenAI-compatible use is available only when you configure an API key." />
      <div className="panel mb-4 grid gap-3 p-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-semibold">Provider<select className="field" value={provider} onChange={(e) => { setProvider(e.target.value); setModel(e.target.value === "openai" ? "gpt-4o-mini" : "llama3.1"); }}><option value="ollama">Ollama local</option><option value="openai">OpenAI-compatible</option></select></label>
        <label className="grid gap-1 text-sm font-semibold">Model<input className="field" value={model} onChange={(e) => setModel(e.target.value)} /></label>
        <div className="rounded-md border border-[#243142] bg-[#0d131b] p-3 text-xs text-[#8ea0b5]">Default is Ollama at http://localhost:11434 using OLLAMA_MODEL or llama3.1.</div>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="panel grid gap-3 p-4">
          <h2 className="text-lg font-bold">Explain a missed question</h2>
          <label className="grid gap-1 text-sm font-semibold">Question<textarea className="field min-h-32" value={question} onChange={(e) => setQuestion(e.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">My attempted answer<textarea className="field" value={attemptedAnswer} onChange={(e) => setAttemptedAnswer(e.target.value)} /></label>
          <label className="grid gap-1 text-sm font-semibold">Correct answer<textarea className="field" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} /></label>
          <div className="grid gap-2">
            <div className="text-sm font-bold">Mistake tags</div>
            {mistakeTags.map((tag) => (
              <label key={tag} className="flex gap-2 text-sm text-[#c7d2e1]"><input type="checkbox" checked={selectedTags.includes(tag)} onChange={(e) => setSelectedTags((current) => e.target.checked ? [...current, tag] : current.filter((item) => item !== tag))} />{tag}</label>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => run("/api/ai/explain", { question, attemptedAnswer, correctAnswer, mistakeTags: selectedTags })}>Explain</button>
        </div>

        <div className="panel grid content-start gap-3 p-4">
          <h2 className="text-lg font-bold">Generate original practice</h2>
          <SelectField label="Section" name="section" value={generator.section} onChange={(v) => setGenerator((g) => ({ ...g, section: v }))} options={sections} />
          <SelectField label="Question type" name="type" value={generator.type} onChange={(v) => setGenerator((g) => ({ ...g, type: v }))} options={questionTypes} />
          <label className="grid gap-1 text-sm font-semibold">Concept<input className="field" value={generator.concept} onChange={(e) => setGenerator((g) => ({ ...g, concept: e.target.value }))} /></label>
          <SelectField label="Difficulty" name="difficulty" value={generator.difficulty} onChange={(v) => setGenerator((g) => ({ ...g, difficulty: v }))} options={difficulties} />
          <label className="grid gap-1 text-sm font-semibold">Number of questions<input className="field" type="number" min="1" max="10" value={generator.count} onChange={(e) => setGenerator((g) => ({ ...g, count: e.target.value }))} /></label>
          <button className="btn btn-primary" onClick={() => run("/api/ai/generate", generator)}>Generate</button>
          <div className="text-xs text-[#8ea0b5]">Generated items are text-only so you can inspect them before adding any to the question bank.</div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="panel p-4">
          <h2 className="mb-3 font-bold">Output</h2>
          {error ? <p className="mb-3 text-sm text-[#fb7185]">{error}</p> : null}
          <pre className="min-h-72 whitespace-pre-wrap rounded-md bg-[#0d131b] p-4 text-sm text-[#c7d2e1]">{output || "AI output appears here."}</pre>
        </div>
        <div className="panel p-4">
          <h2 className="mb-3 font-bold">Manual prompt</h2>
          <pre className="min-h-72 whitespace-pre-wrap rounded-md bg-[#0d131b] p-4 text-xs text-[#8ea0b5]">{prompt || "The prompt used for AI calls appears here after a request."}</pre>
        </div>
      </section>
    </>
  );
}
