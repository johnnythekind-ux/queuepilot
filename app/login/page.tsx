import Header from "@/components/Header";
import { logIn } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-md px-6 py-20">

        {params.message === "check_email" && (
  <div className="mb-6 rounded-lg border border-green-800 bg-green-950 px-4 py-3 text-sm text-green-200">
    Check your email to confirm your account.
  </div>
)}

{params.error === "login_failed" && (
  <div className="mb-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
    Login failed. Check your email and password.
  </div>
)}

        <h1 className="mb-3 text-3xl font-bold">Log in</h1>

        <p className="mb-8 text-slate-300">
          Access your QueuePilot dashboard.
        </p>

        <form action={logIn} className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}