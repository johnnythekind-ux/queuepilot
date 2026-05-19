import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processAIJob } from "@/lib/jobs/aiProcessor";

export async function POST() {
  const supabase = await createClient();

  const processingTimeout = new Date(Date.now() - 5 * 60 * 1000).toISOString();

await supabase
  .from("jobs")
  .update({
    status: "retrying",
    error_message: "Job timed out while processing and was returned to retry queue.",
    updated_at: new Date().toISOString(),
  })
  .eq("status", "processing")
  .lt("updated_at", processingTimeout);

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .in("status", ["queued", "retrying"])
    .limit(5);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs." },
      { status: 500 }
    );
  }

  await Promise.all(
  jobs.map(async (job) => {
    const { data: claimedJob, error: claimError } = await supabase
  .from("jobs")
  .update({
    status: "processing",
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  .eq("id", job.id)
  .in("status", ["queued", "retrying"])
  .select()
  .single();

if (claimError || !claimedJob) {
  return;
}

await supabase.from("job_events").insert({
  user_id: job.user_id,
  job_id: job.id,
  event_type: "job_processing",
  message: `Job "${job.title}" entered processing.`,
});

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const shouldFail = job.input.toLowerCase().includes("fail");

    if (shouldFail) {
      await supabase
        .from("jobs")
        .update({
          status: "failed",
          error_message: "Worker failed because input contained fail.",
          failed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      return;
    }

    try {
      const result = await processAIJob({
        title: job.title,
        jobType: job.job_type,
        input: job.input,
      });

      await supabase
        .from("jobs")
        .update({
          status: "completed",
          result,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

await supabase.from("job_events").insert({
  user_id: job.user_id,
  job_id: job.id,
  event_type: "job_completed",
  message: `Job "${job.title}" completed successfully.`,
});

    } catch {
      await supabase
        .from("jobs")
        .update({
          status: "failed",
          error_message: "OpenAI processing failed.",
          failed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

await supabase.from("job_events").insert({
  user_id: job.user_id,
  job_id: job.id,
  event_type: "job_failed",
  message: `Job "${job.title}" failed during processing.`,
});

    }
  })
);

  return NextResponse.json({
    success: true,
    processed: jobs.length,
  });
}