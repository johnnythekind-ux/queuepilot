import { processJob } from "@/lib/jobs/actions";

type ProcessJobButtonProps = {
  jobId: string;
};

export default function ProcessJobButton({ jobId }: ProcessJobButtonProps) {
  return (
    <form action={processJob.bind(null, jobId)}>
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
      >
        Process Job
      </button>
    </form>
  );
}