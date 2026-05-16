import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AutoRefresh from "@/components/AutoRefresh";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
  .from("jobs")
  .select("*");

  const totalJobs = jobs?.length || 0;

const queuedJobs =
  jobs?.filter((job) => job.status === "queued").length || 0;

const processingJobs =
  jobs?.filter((job) => job.status === "processing").length || 0;

const completedJobs =
  jobs?.filter((job) => job.status === "completed").length || 0;

const failedJobs =
  jobs?.filter((job) => job.status === "failed").length || 0;

  const deadLetterJobs =
  jobs?.filter(
    (job) => job.status === "failed" && job.attempt_count >= 3
  ) || [];

  const successRate =
  totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

const failureRate =
  totalJobs > 0 ? Math.round((failedJobs / totalJobs) * 100) : 0;

const completedWithTimes =
  jobs?.filter((job) => job.started_at && job.completed_at) || [];

const averageProcessingTime =
  completedWithTimes.length > 0
    ? (
        completedWithTimes.reduce((total, job) => {
          return (
            total +
            (new Date(job.completed_at).getTime() -
              new Date(job.started_at).getTime()) /
              1000
          );4
        }, 0) / completedWithTimes.length
      ).toFixed(1)
    : null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />
      <AutoRefresh />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-3 text-3xl font-bold">Dashboard</h1>

        <p className="text-slate-300">
          Welcome back, {user.email}. QueuePilot dashboard is now protected.
        </p>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "32px",
    marginBottom: "40px",
  }}
>
  <div
    style={{
      backgroundColor: "#081028",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "24px",
    }}
  >
    <h3>Total Jobs</h3>
    <p style={{ fontSize: "32px", fontWeight: "bold" }}>
      {totalJobs}
    </p>
  </div>

  <div
    style={{
      backgroundColor: "#081028",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "24px",
    }}
  >
    <h3>Queued</h3>
    <p style={{ fontSize: "32px", fontWeight: "bold" }}>
      {queuedJobs}
    </p>
  </div>

  <div
    style={{
      backgroundColor: "#081028",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "24px",
    }}
  >
    <h3>Processing</h3>
    <p style={{ fontSize: "32px", fontWeight: "bold" }}>
      {processingJobs}
    </p>
  </div>

  <div
    style={{
      backgroundColor: "#081028",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "24px",
    }}
  >
    <h3>Completed</h3>
    <p style={{ fontSize: "32px", fontWeight: "bold" }}>
      {completedJobs}
    </p>
  </div>

  <div
    style={{
      backgroundColor: "#081028",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "24px",
    }}
  >
    <h3>Failed</h3>
    <p style={{ fontSize: "32px", fontWeight: "bold" }}>
      {failedJobs}
    </p>
  </div>
  <div
  style={{
    backgroundColor: "#081028",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "24px",
  }}
>
  <h3>Success Rate</h3>
  <p style={{ fontSize: "32px", fontWeight: "bold" }}>
    {successRate}%
  </p>
</div>

<div
  style={{
    backgroundColor: "#081028",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "24px",
  }}
>
  <h3>Failure Rate</h3>
  <p style={{ fontSize: "32px", fontWeight: "bold" }}>
    {failureRate}%
  </p>
</div>

<div
  style={{
    backgroundColor: "#081028",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "24px",
  }}
>
  <h3>Avg Processing</h3>
  <p style={{ fontSize: "32px", fontWeight: "bold" }}>
    {averageProcessingTime
      ? `${averageProcessingTime}s`
      : "--"}
  </p>
</div>
</div>

<div
  style={{
    marginTop: "24px",
    backgroundColor: "#081028",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "24px",
  }}
>
  <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
    Recent Jobs
  </h2>

  <div style={{ display: "grid", gap: "12px" }}>
    {jobs?.slice(0, 5).map((job) => {
  const processingTime =
    job.started_at && job.completed_at
      ? (
          (new Date(job.completed_at).getTime() -
            new Date(job.started_at).getTime()) /
          1000
        ).toFixed(1)
      : null;

  return (
        
      <div
        key={job.id}
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap: "16px",
          borderBottom: "1px solid #1e293b",
          paddingBottom: "12px",
        }}
      >
        <div>{job.title}</div>
        <div>{job.job_type}</div>
        <div
  style={{
    color:
      job.status === "completed"
        ? "#22c55e"
        : job.status === "failed"
        ? "#ef4444"
        : job.status === "processing"
        ? "#facc15"
        : "#94a3b8",
    fontWeight: "bold",
  }}
>
  {job.status}
</div>
        <div>{new Date(job.created_at).toLocaleDateString()}</div>
        <div>
  {processingTime ? `${processingTime}s` : "-"}
</div>
      </div>
    );
})}
  </div>
</div>

<div
  style={{
    marginTop: "48px",
    backgroundColor: "#1a0000",
    border: "1px solid #7f1d1d",
    borderRadius: "16px",
    padding: "24px",
  }}
>
  <h2
    style={{
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#fca5a5",
    }}
  >
    Dead Letter Queue
  </h2>

  {deadLetterJobs.length === 0 ? (
    <p style={{ color: "#fca5a5" }}>
      No jobs currently require manual review.
    </p>
  ) : (
    <div style={{ display: "grid", gap: "16px" }}>
      {deadLetterJobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #7f1d1d",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#2b0000",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            {job.title}
          </div>

          <div style={{ color: "#fca5a5", marginBottom: "6px" }}>
            Status: {job.status}
          </div>

          <div style={{ color: "#fca5a5", marginBottom: "6px" }}>
            Attempts: {job.attempt_count}
          </div>

          <div style={{ color: "#fca5a5" }}>
            Requires manual intervention.
          </div>
        </div>
      ))}
    </div>
  )}
</div>

<div
  style={{
    marginTop: "32px",
    backgroundColor: "#081028",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "24px",
  }}
>
  <h2
    style={{
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    }}
  >
    Worker Health
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
    }}
  >
    <div>
      <p style={{ color: "#94a3b8" }}>Worker Mode</p>
      <p style={{ fontWeight: "bold" }}>Simulated</p>
    </div>

    <div>
      <p style={{ color: "#94a3b8" }}>Processing Style</p>
      <p style={{ fontWeight: "bold" }}>Parallel</p>
    </div>

    <div>
      <p style={{ color: "#94a3b8" }}>AI Engine</p>
      <p style={{ fontWeight: "bold" }}>OpenAI</p>
    </div>

    <div>
      <p style={{ color: "#94a3b8" }}>Queue Backend</p>
      <p style={{ fontWeight: "bold" }}>Supabase Jobs Table</p>
    </div>

    <div>
      <p style={{ color: "#94a3b8" }}>Refresh Mode</p>
      <p style={{ fontWeight: "bold" }}>Auto Refresh</p>
    </div>

    <div>
      <p style={{ color: "#94a3b8" }}>Max Jobs Per Run</p>
      <p style={{ fontWeight: "bold" }}>5</p>
    </div>
  </div>
</div>
<div
  style={{
    marginTop: "32px",
    backgroundColor: "#081028",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "24px",
  }}
>
  <h2
    style={{
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    }}
  >
    Queue Activity
  </h2>

  <div style={{ display: "grid", gap: "14px" }}>
    {jobs?.slice(0, 6).map((job) => (
      <div
        key={job.id}
        style={{
          borderLeft: `4px solid ${
            job.status === "completed"
              ? "#22c55e"
              : job.status === "failed"
              ? "#ef4444"
              : job.status === "processing"
              ? "#facc15"
              : "#64748b"
          }`,
          paddingLeft: "16px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{job.title}</p>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          Status: {job.status} • Type: {job.job_type}
        </p>
        <p style={{ color: "#64748b", fontSize: "13px" }}>
          Created {new Date(job.created_at).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
</div>
      </section>
    </main>
  );
}