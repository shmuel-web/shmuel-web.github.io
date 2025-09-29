"use client";

import { useEffect, useMemo, useState } from "react";

export default function ComingSoon() {
  // Fixed target: 14/10/25 11:59:13 (DD/MM/YY HH:mm:ss). Months are 0-based → 9 = October.
  const targetDate = useMemo(() => new Date(2025, 9, 14, 11, 59, 13), []);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="mt-12 w-full rounded-lg border border-black/[.08] dark:border-white/[.145] p-6 text-center">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Coming Soon</h2>
      <p className="mt-2 text-sm sm:text-base text-foreground/80">
        I'm building this section of the blog. Check back shortly.
      </p>
      <div className="mt-4 inline-flex items-center justify-center gap-4 font-mono text-sm sm:text-base" aria-live="polite">
        <div className="min-w-16">
          <div className="text-2xl font-semibold tabular-nums">{days}</div>
          <div className="text-foreground/70">days</div>
        </div>
        <div className="min-w-16">
          <div className="text-2xl font-semibold tabular-nums">{hours.toString().padStart(2, "0")}</div>
          <div className="text-foreground/70">hours</div>
        </div>
        <div className="min-w-16">
          <div className="text-2xl font-semibold tabular-nums">{minutes.toString().padStart(2, "0")}</div>
          <div className="text-foreground/70">minutes</div>
        </div>
        <div className="min-w-16">
          <div className="text-2xl font-semibold tabular-nums">{seconds.toString().padStart(2, "0")}</div>
          <div className="text-foreground/70">seconds</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-foreground/60">
        Launching on 14/10/25 11:59:13
      </div>
    </div>
  );
}


