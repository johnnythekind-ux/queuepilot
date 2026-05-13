"use client";

export default function RunWorkerButton() {
  async function runWorker() {
    await fetch("/api/process-jobs", {
      method: "POST",
    });

    window.location.reload();
  }

  return (
    <button
      onClick={runWorker}
      className="rounded-lg border border-slate-700 px-4 py-3 font-semibold text-slate-200 hover:bg-slate-800"
    >
      Run Worker
    </button>
  );
}