import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  for (const job of jobs) {
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
    } else {
      await supabase
        .from("jobs")
        .update({
          status: "completed",
          result: "Async worker completed this job successfully.",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }
  }

  return NextResponse.json({
    success: true,
    processed: jobs.length,
  });
}