"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiTranslate } from "@mdi/js";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { usePathname } from "next/navigation";

export default function LanguageMenu() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "he" : "en";

  const target = (() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return `/${otherLocale}`;
    parts[0] = otherLocale;
    return "/" + parts.join("/");
  })();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-[var(--hover-bg)]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={dict.footer.language}
      >
        <Icon path={mdiTranslate} size={1} />
      </button>
      {open && (
        <div className="absolute z-20 right-0 bottom-full mb-2 min-w-32 rounded-md border border-[var(--border-color)] bg-[var(--background)] p-1 shadow-md" role="menu">
          <Link 
            href={target} 
            onClick={() => {
              // Save user preference to localStorage
              localStorage.setItem('preferredLocale', otherLocale);
              setOpen(false);
            }} 
            className="block w-full text-start rounded px-3 py-2 text-sm hover:bg-[var(--hover-bg)]"
          >
            {otherLocale === "en" ? dict.footer.english : dict.footer.hebrew}
            <span className="text-xs text-foreground/60 ml-1">(Set as default)</span>
          </Link>
          <button disabled className="block w-full text-start rounded px-3 py-2 text-sm opacity-60">
            {locale === "en" ? dict.footer.english : dict.footer.hebrew}
            <span className="text-xs text-foreground/60 ml-1">(Current)</span>
          </button>
        </div>
      )}
    </div>
  );
}


