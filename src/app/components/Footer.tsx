"use client";

 
import { useI18n } from "@/i18n/I18nProvider";
import ThemeToggle from "./ThemeToggle";
import LanguageMenu from "./LanguageMenu";
import Icon from "@mdi/react";
import { mdiLinkedin } from "@mdi/js";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  const { dict } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Defer theme detection to client after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const explicit = root.getAttribute("data-theme");
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const determine = () => setIsDark(explicit ? explicit === "dark" : mql.matches);
    determine();
    const onChange = () => determine();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <footer className="mt-16 border-t border-[var(--border-color)] py-6">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 flex flex-col items-center justify-center gap-3">
        <div className="w-full flex items-center justify-between">

          <div className="inline-flex items-center gap-5">
          <a
            href="https://www.linkedin.com/in/shmuel-disraeli/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded p-1 hover:bg-[var(--hover-bg)]"
            aria-label={dict.footer.linkedIn}
            title={dict.footer.linkedIn}
          >
              <Icon path={mdiLinkedin} size={1} />
          </a>
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded p-1 hover:bg-[var(--hover-bg)]"
            aria-label={dict.footer.twitter}
            title={dict.footer.twitter}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <g>
                  <path d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z" fill="currentColor"/>
                </g>
              </svg>
            </a>
          <a
            href="https://medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded p-1 hover:bg-[var(--hover-bg)]"
            aria-label={dict.footer.medium}
            title={dict.footer.medium}
            >
              {mounted ? (
                <Image 
                  src={isDark ? "/Medium-Icon-White.svg" : "/Medium-Icon-Black.svg"} 
                  alt="Medium" 
                  width={20} 
                  height={20}
                  className="w-5 h-5"
                />
              ) : (
                <span className="block w-5 h-5" aria-hidden="true" />
              )}
            </a>
          </div>

          <div className="inline-flex items-center gap-4">
            <LanguageMenu />
            <ThemeToggle />
          </div>
          
        </div>
      </div>
    </footer>
  );
}


