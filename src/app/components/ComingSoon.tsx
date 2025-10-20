"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export default function ComingSoon() {
  const { locale, dict } = useI18n();
  // Fixed target: 31/03/25 23:59:59 (DD/MM/YY HH:mm:ss). Months are 0-based → 2 = March.
  const targetDate = useMemo(() => new Date(2025, 2, 31, 23, 59, 59), []);
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

  const resolvedLocale = locale === "he" ? "he-IL" : "en-US";
  const formattedTarget = useMemo(() => {
    const dateFormatter = new Intl.DateTimeFormat(resolvedLocale, {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
    const timeFormatter = new Intl.DateTimeFormat(resolvedLocale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${dateFormatter.format(targetDate)} ${timeFormatter.format(targetDate)}`;
  }, [resolvedLocale, targetDate]);

  const unitOrder = locale === "he" ? ["seconds", "minutes", "hours", "days"] : ["days", "hours", "minutes", "seconds"] as const;
  const timeItems = unitOrder.map((unit) => {
    const value =
      unit === "days"
        ? String(days)
        : unit === "hours"
        ? hours.toString().padStart(2, "0")
        : unit === "minutes"
        ? minutes.toString().padStart(2, "0")
        : seconds.toString().padStart(2, "0");
    const label =
      unit === "days"
        ? dict.comingSoon.units.days
        : unit === "hours"
        ? dict.comingSoon.units.hours
        : unit === "minutes"
        ? dict.comingSoon.units.minutes
        : dict.comingSoon.units.seconds;
    return { value, label };
  });

  return (
    <div className="mt-12 w-full rounded-lg border border-[var(--border-color)] p-6 text-center">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{dict.comingSoon.title}</h2>
      <p className="mt-2 text-sm sm:text-base text-foreground/80">
        {dict.comingSoon.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-sm sm:text-base" aria-live="polite">
        {timeItems.map((item, index) => (
          <div className="min-w-14 sm:min-w-16" key={index}>
            <div className="text-2xl font-semibold tabular-nums">{item.value}</div>
            <div className="text-foreground/70">{item.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-foreground/60">
        {dict.comingSoon.launchOn} {formattedTarget}
      </div>
    </div>
  );
}


