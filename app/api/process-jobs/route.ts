import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processAIJob } from "@/lib/jobs/aiProcessor";

export async function POST() {
  const supabase = await createClient();

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
    await supabase
      .from("jobs")
      .update({
        status: "processing",
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

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
    }
  })
);

  return NextResponse.json({
    success: true,
    processed: jobs.length,
  });
}