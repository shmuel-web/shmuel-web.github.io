"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={
        "px-2 py-1 rounded hover:bg-black/[.04] dark:hover:bg-white/[.06]" +
        (isActive ? " underline underline-offset-4" : "")
      }
    >
      {label}
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-black/[.08] dark:border-white/[.145]">
      <div className="max-w-2xl mx-auto w-full px-8 sm:px-12 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          My Blog
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:text-base">
          <NavLink href="/about" label="About" />
          <NavLink href="/work" label="Work" />
          <NavLink href="/blog" label="Blog" />
        </nav>
      </div>
    </header>
  );
}


