"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={
        "px-2 py-1 rounded hover:bg-[var(--hover-bg)]" +
        (isActive ? " underline underline-offset-4" : "")
      }
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const { locale, dict } = useI18n();
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-[var(--border-color)]">
      <div className="max-w-2xl mx-auto w-full px-8 sm:px-12 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-semibold tracking-tight flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-5 w-5" />
          {dict.siteTitle}
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:text-base">
          <NavLink href={`/${locale}/about`} label={dict.nav.about} />
          <NavLink href={`/${locale}/work`} label={dict.nav.work} />
          <NavLink href={`/${locale}/blog`} label={dict.nav.blog} />
        </nav>
      </div>
    </header>
  );
}


