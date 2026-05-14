import { openai } from "@/lib/openai";

type ProcessAIJobInput = {
  title: string;
  jobType: string;
  input: string;
};

export async function processAIJob({
  title,
  jobType,
  input,
}: ProcessAIJobInput) {
  let instructions = "";

  if (jobType === "report_summary") {
    instructions =
      "Summarize the user's input into a clear, concise professional report.";
  } else if (jobType === "lead_analysis") {
    instructions =
      "Analyze this real estate lead information. Identify opportunity, risk, lead quality, and recommended next steps.";
  } else if (jobType === "cold_email_writer") {
    instructions =
      "Write a professional cold outreach email based on the user's input. Keep it clear, persuasive, and respectful.";
  } else if (jobType === "property_score") {
    instructions =
      "Score this real estate opportunity from 0 to 100 and explain the reasoning clearly.";
  } else if (jobType === "seller_motivation") {
    instructions =
      "Analyze the seller motivation signals in the user's input and explain what they may indicate.";
  } else {
    instructions =
      "Process the user's input and return a helpful professional result.";
  }

  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: `You are QueuePilot, an async AI job processor.

Job title: ${title}
Job type: ${jobType}

Instructions:
${instructions}

User input:
${input}

Return the result in a helpful, structured format.`,
  });

  return completion.output_text;
}