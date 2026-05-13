"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title"));
  const jobType = String(formData.get("job_type"));
  const input = String(formData.get("input"));

  const { error } = await supabase.from("jobs").insert({
    user_id: user.id,
    title,
    job_type: jobType,
    input,
    status: "queued",
    attempt_count: 0,
  });

  if (error) {
    redirect("/jobs/new?error=create_failed");
  }

  redirect("/jobs");
}

export async function processJob(jobId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !job) {
    redirect("/jobs");
  }

  await supabase
    .from("jobs")
    .update({
      status: "processing",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .eq("user_id", user.id);

  const shouldFail = job.input.toLowerCase().includes("fail");

  if (shouldFail) {
    await supabase
      .from("jobs")
      .update({
        status: "failed",
        error_message:
          "Job failed because the input contained the word fail.",
        failed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("jobs")
      .update({
        status: "completed",
        result:
          "Processed successfully. QueuePilot completed this simulated async job.",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("user_id", user.id);
  }

  redirect(`/jobs/${jobId}`);
}

export async function retryJob(jobId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: job, error: fetchError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !job) {
    redirect("/jobs");
  }

  if (job.status !== "failed") {
    redirect(`/jobs/${jobId}`);
  }

  await supabase
    .from("jobs")
    .update({
      status: "retrying",
      error_message: null,
      attempt_count: job.attempt_count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .eq("user_id", user.id);

  redirect(`/jobs/${jobId}`);
}

export async function deleteJob(jobId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", user.id);

  redirect("/jobs");
}