"use client";

import { useI18n } from "@/i18n/I18nProvider";
import SvgAnimation from "../components/SvgAnimation";

export default function Home() {
  const { dict } = useI18n();
  return (
    <main className="max-w-2xl mx-auto w-full p-8 sm:p-12">
      {/* Jumbotron with SVG Animation */}
      <SvgAnimation />
      
      <h1 className="text-3xl sm:text-4xl font-bold">{dict.home.title}</h1>
      <p className="mt-3 text-foreground/80">{dict.home.welcome}</p>
    </main>
  );
}
