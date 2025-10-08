"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiWeatherNight, mdiWhiteBalanceSunny } from "@mdi/js";
import { useI18n } from "@/i18n/I18nProvider";

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
  const { dict } = useI18n();
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const effectiveTheme: "light" | "dark" = choice === "system" ? (systemPrefersDark ? "dark" : "light") : choice;
  const isDark = effectiveTheme === "dark";
  const title = `${dict.footer.theme.label}: ${
    choice === "system" ? dict.footer.theme.system : choice === "dark" ? dict.footer.theme.dark : dict.footer.theme.light
  }`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-[var(--hover-bg)]"
        onClick={() => setOpen((v) => !v)}
        title={title}
        aria-label={title}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {isDark ? <Icon path={mdiWeatherNight} size={1} /> : <Icon path={mdiWhiteBalanceSunny} size={1} />}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute z-20 right-0 bottom-full mb-2 min-w-32 rounded-md border border-[var(--border-color)] bg-[var(--background)] p-1 shadow-md"
        >
          <MenuItem
            active={choice === "dark"}
            onSelect={() => {
              setChoice("dark");
              setOpen(false);
            }}
            label={dict.footer.theme.dark}
          />
          <MenuItem
            active={choice === "light"}
            onSelect={() => {
              setChoice("light");
              setOpen(false);
            }}
            label={dict.footer.theme.light}
          />
          <MenuItem
            active={choice === "system"}
            onSelect={() => {
              setChoice("system");
              setOpen(false);
            }}
            label={dict.footer.theme.system}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onSelect, active }: { label: string; onSelect: () => void; active: boolean }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={onSelect}
      className={`block w-full text-start rounded px-3 py-2 text-sm hover:bg-[var(--hover-bg)] ${
        active ? "opacity-100" : "opacity-80"
      }`}
    >
      {label}
    </button>
  );
}


