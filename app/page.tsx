import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-400">
            CRS Mechanical App #4
          </p>

          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            QueuePilot
          </h1>

          <p className="mb-8 text-xl leading-8 text-slate-300">
            A production-style async job system that models how real
            applications handle work over time instead of instantly.
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-3 text-lg font-semibold">Core System Pattern</h2>

            <p className="text-slate-300">
              User submits a job → system stores job → job moves through
              statuses → result appears later.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}