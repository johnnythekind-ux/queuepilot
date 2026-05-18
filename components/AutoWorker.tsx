"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoWorker() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetch("/api/process-jobs", {
        method: "POST",
      });

      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}