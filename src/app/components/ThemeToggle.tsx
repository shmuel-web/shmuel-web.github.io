"use client";

import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiWeatherNight, mdiWhiteBalanceSunny } from "@mdi/js";

type ThemeChoice = "light" | "dark" | "system";

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", choice);
  }
}

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false);

  // Initialize from localStorage and apply; capture current system preference
  useEffect(() => {
    setChoice("system");
    applyTheme("system");

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPrefersDark(mql.matches);
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Apply when choice changes
  useEffect(() => {
    applyTheme(choice);
  }, [choice]);

  function cycleChoice() {
    // If currently system: set explicit theme opposite of current effective theme
    if (choice === "system") {
      setChoice(systemPrefersDark ? "light" : "dark");
      return;
    }
    // Toggle between explicit light/dark
    setChoice(choice === "light" ? "dark" : "light");
  }

  const effectiveTheme: "light" | "dark" = choice === "system" ? (systemPrefersDark ? "dark" : "light") : choice;
  const isDark = effectiveTheme === "dark";
  const title = `Theme: ${choice} (click to switch)`;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-md border border-[var(--border-color)] p-1 text-sm hover:bg-[var(--hover-bg)]"
      onClick={cycleChoice}
      title={title}
      aria-label={title}
    >
      {isDark ? <Icon path={mdiWeatherNight} size={1} /> : <Icon path={mdiWhiteBalanceSunny} size={1} />}
    </button>
  );
}


