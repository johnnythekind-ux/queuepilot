import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProcessJobButton from "@/components/ProcessJobButton";
import RetryJobButton from "@/components/RetryJobButton";
import DeleteJobButton from "@/components/DeleteJobButton";

type JobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobPage({
  params,
}: JobPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    redirect("/jobs");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold">
            {job.title}
          </h1>

          <p className="text-slate-300">
            Full async job details.
          </p>

          {job.status === "queued" && (
  <div className="mt-6">
    <ProcessJobButton jobId={job.id} />
  </div>
)}

{job.status === "failed" && (
  <div className="mt-6">
    <RetryJobButton jobId={job.id} />
  </div>
)}

<div className="mt-4">
  <DeleteJobButton jobId={job.id} />
</div>

        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Job Info
            </h2>

            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
              <p>
                <span className="font-semibold text-white">
                  Status:
                </span>{" "}
                {job.status}
              </p>

              <p>
                <span className="font-semibold text-white">
                  Job Type:
                </span>{" "}
                {job.job_type}
              </p>

              <p>
                <span className="font-semibold text-white">
                  Attempts:
                </span>{" "}
                {job.attempt_count}
              </p>

              <p>
                <span className="font-semibold text-white">
                  Created:
                </span>{" "}
                {new Date(job.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Input
            </h2>

            <pre className="whitespace-pre-wrap text-sm text-slate-300">
              {job.input}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Result
            </h2>

            <pre className="whitespace-pre-wrap text-sm text-slate-300">
              {job.result || "No result yet."}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Error Message
            </h2>

            <pre className="whitespace-pre-wrap text-sm text-red-300">
              {job.error_message || "No errors."}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}