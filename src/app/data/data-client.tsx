"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";

export function DataClient() {
  const [payload, setPayload] = useState("");
  const [message, setMessage] = useState("");

  async function exportJson() {
    const response = await fetch("/api/data/export");
    setPayload(JSON.stringify(await response.json(), null, 2));
  }

  async function importJson() {
    setMessage("");
    const response = await fetch("/api/data/import", { method: "POST", headers: { "content-type": "application/json" }, body: payload });
    const data = await response.json();
    setMessage(response.ok ? "Import complete." : data.error || "Import failed.");
  }

  return (
    <>
      <PageHeader title="Import / Export" subtitle="Keep backups, move machines, or analyze attempts outside the app." />
      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="panel grid content-start gap-3 p-4">
          <button className="btn btn-primary" onClick={exportJson}>Export all data as JSON</button>
          <a className="btn" href="/api/data/attempts.csv">Export attempts/error log CSV</a>
          <button className="btn btn-danger" onClick={importJson}>Import JSON and replace local data</button>
          {message ? <p className="text-sm text-[#8ea0b5]">{message}</p> : null}
        </div>
        <textarea className="field min-h-[560px] font-mono text-xs" value={payload} onChange={(event) => setPayload(event.target.value)} placeholder="Exported JSON appears here. Paste JSON here before importing." />
      </section>
    </>
  );
}
