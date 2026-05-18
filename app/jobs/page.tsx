import Header from "@/components/Header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RunWorkerButton from "@/components/RunWorkerButton";
import AutoRefresh from "@/components/AutoRefresh";
import AutoWorker from "@/components/AutoWorker";

export default async function JobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, job_type, status, attempt_count, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load jobs.");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />
      <AutoWorker />
      <AutoRefresh />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-3 text-3xl font-bold">Jobs</h1>
            <p className="text-slate-300">
              Track submitted jobs and their current status.
            </p>
          </div>

          <div className="flex gap-3">
  <RunWorkerButton />

  <Link
    href="/jobs/new"
    className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
  >
    New Job
  </Link>
</div>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="mb-2 text-xl font-semibold">No jobs yet</h2>
            <p className="mb-6 text-slate-300">
              Create your first job to begin tracking async work.
            </p>

            <Link
              href="/jobs/new"
              className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Create Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-600"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">{job.title}</h2>

                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                    {job.status}
                  </span>
                </div>

                <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                  <p>Type: {job.job_type}</p>
                  <p>Attempts: {job.attempt_count}</p>
                  <p>
                    Created:{" "}
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}