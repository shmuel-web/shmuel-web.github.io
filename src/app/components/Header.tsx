"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { useState } from "react";

type Dictionary = {
  siteTitle: string;
  nav: {
    about: string;
    work: string;
    blog: string;
  };
  [key: string]: string | { [key: string]: string | { [key: string]: string } };
};

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        "px-2 py-1 rounded hover:bg-[var(--hover-bg)] transition-colors" +
        (isActive ? " underline underline-offset-4" : "")
      }
    >
      {label}
    </Link>
  );
}

function MobileMenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-md hover:bg-[var(--hover-bg)] transition-colors"
      aria-label="Toggle menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`block w-5 h-0.5 bg-current transition-all duration-500 ${
            isOpen ? "rotate-45 translate-y-0.5" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-current transition-all duration-300  ${
            isOpen ? "-rotate-45 -translate-y-1.5" : "mt-1"
          }`}
        />
      </div>
    </button>
  );
}

function MobileMenu({ isOpen, onClose, locale, dict }: { 
  isOpen: boolean; 
  onClose: () => void; 
  locale: string; 
  dict: Dictionary;
}) {
  return (
    <div
      className={`absolute top-full left-0 w-full bg-[var(--background)] border-b border-[var(--border-color)] z-50 transition-all duration-300 ${
        isOpen ? "h-[calc(100vh-3.5rem)] opacity-100" : "h-0 opacity-0"
      } overflow-hidden`}
    >
      <div className="p-6 h-full">
        <nav className="flex flex-col gap-4 text-lg h-full justify-center">
          <NavLink 
            href={`/${locale}/about`} 
            label={dict.nav.about} 
            onClick={onClose}
          />
          <NavLink 
            href={`/${locale}/work`} 
            label={dict.nav.work} 
            onClick={onClose}
          />
          <NavLink 
            href={`/${locale}/blog`} 
            label={dict.nav.blog} 
            onClick={onClose}
          />
        </nav>
      </div>
    </div>
  );
}

function DesktopHeader({ locale, dict }: { locale: string; dict: Dictionary }) {
  return (
    <header className="hidden md:block backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-[var(--border-color)]">
      <div className="max-w-2xl mx-auto w-full px-8 sm:px-12 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-semibold tracking-tight flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={20} height={20} className="h-5 w-5" />
          {dict.siteTitle}
        </Link>
        
        <nav className="flex items-center gap-3 text-sm lg:text-base">
          <NavLink href={`/${locale}/about`} label={dict.nav.about} />
          <NavLink href={`/${locale}/work`} label={dict.nav.work} />
          <NavLink href={`/${locale}/blog`} label={dict.nav.blog} />
        </nav>
      </div>
    </header>
  );
}

function MobileHeader({ locale, dict }: { locale: string; dict: Dictionary }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="block md:hidden sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-[var(--border-color)]">
      <div className="max-w-2xl mx-auto w-full px-8 sm:px-12 h-14 flex items-center justify-between relative">
        <Link href={`/${locale}`} className="font-semibold tracking-tight flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={20} height={20} className="h-5 w-5" />
          {dict.siteTitle}
        </Link>
        
        <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={closeMobileMenu}
          locale={locale}
          dict={dict}
        />
      </div>
    </header>
  );
}

export default function Header() {
  const { locale, dict } = useI18n();

  return (
    <>
      <MobileHeader locale={locale} dict={dict} />
      <DesktopHeader locale={locale} dict={dict} />
    </>
  );
}


