import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-3 text-3xl font-bold">Dashboard</h1>

        <p className="text-slate-300">
          Welcome back, {user.email}. QueuePilot dashboard is now protected.
        </p>
      </section>
    </main>
  );
}