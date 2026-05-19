import Header from "@/components/Header";
import { createJob } from "@/lib/jobs/actions";

export default function NewJobPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-3xl font-bold">Create Job</h1>

        <p className="mb-8 text-slate-300">
          Submit a job to QueuePilot. It will start in queued status.
        </p>

        <form action={createJob} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Job Title
            </label>
            <input
              name="title"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Analyze lead list"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Job Type
            </label>
            <select
              name="job_type"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              defaultValue="report_summary"
            >
              <option value="report_summary">Report Summary</option>

<option value="lead_analysis">
  Lead Analysis
</option>

<option value="cold_email_writer">
  Cold Email Writer
</option>

<option value="property_score">
  Property Score
</option>

<option value="seller_motivation">
  Seller Motivation
</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Input
            </label>
            <textarea
              name="input"
              required
              rows={6}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Paste the job input here..."
            />
          </div>

          <div className="flex gap-4">
  <button
    type="submit"
    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
  >
    Create Job
  </button>

  <a
    href="/jobs"
    className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800"
  >
    Cancel
  </a>
</div>
        </form>
      </section>
    </main>
  );
}