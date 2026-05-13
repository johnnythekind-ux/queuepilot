import Header from "@/components/Header";
import { signUp } from "@/app/actions/auth";

export default function RequestAccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-md px-6 py-20">
        <h1 className="mb-3 text-3xl font-bold">Request access</h1>

        <p className="mb-8 text-slate-300">
          Create an account to start tracking async jobs.
        </p>

        <form action={signUp} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Create account
          </button>
        </form>
      </section>
    </main>
  );
}