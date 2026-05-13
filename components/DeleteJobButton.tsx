import { deleteJob } from "@/lib/jobs/actions";

type DeleteJobButtonProps = {
  jobId: string;
};

export default function DeleteJobButton({
  jobId,
}: DeleteJobButtonProps) {
  return (
    <form action={deleteJob.bind(null, jobId)}>
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500"
      >
        Delete Job
      </button>
    </form>
  );
}