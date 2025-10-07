"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "he" : "en";

  const target = (() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return `/${otherLocale}`;
    // replace first segment (current locale) with the other locale
    parts[0] = otherLocale;
    return "/" + parts.join("/");
  })();

  return (
    <footer className="mt-16 border-t border-[var(--border-color)] py-6">
      <div className="max-w-2xl mx-auto w-full px-8 sm:px-12 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <div className="inline-flex items-center gap-4">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-[var(--hover-bg)] rounded px-1"
          >
            {dict.footer.linkedIn}
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-[var(--hover-bg)] rounded px-1"
          >
            {dict.footer.twitter}
          </a>
          <a
            href="https://medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-[var(--hover-bg)] rounded px-1"
          >
            {dict.footer.medium}
          </a>
          <span className="mx-2 opacity-50 hidden sm:inline">|</span>
          <Link href={target} className="hover:bg-[var(--hover-bg)] rounded px-1">
            {otherLocale === "en" ? dict.footer.english : dict.footer.hebrew}
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  );
}


