import Link from "next/link";
import { logOut } from "@/app/actions/auth";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          QueuePilot
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/jobs" className="hover:text-white">
            Jobs
          </Link>
          <Link href="/jobs/new" className="hover:text-white">
            New Job
          </Link>
          <form action={logOut}>
  <button
    type="submit"
    className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800"
  >
    Logout
  </button>
</form>
        </nav>
      </div>
    </header>
  );
}