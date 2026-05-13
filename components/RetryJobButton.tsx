import { retryJob } from "@/lib/jobs/actions";

type RetryJobButtonProps = {
  jobId: string;
};

export default function RetryJobButton({ jobId }: RetryJobButtonProps) {
  return (
    <form action={retryJob.bind(null, jobId)}>
      <button
        type="submit"
        className="rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-500"
      >
        Retry Job
      </button>
    </form>
  );
}