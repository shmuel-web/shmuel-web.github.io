"use client";

import { useI18n } from "@/i18n/I18nProvider";
import SvgAnimation from "../components/SvgAnimation";

export default function Home() {
  const { dict } = useI18n();
  return (
    <main className="max-w-2xl mx-auto w-full p-6 sm:p-8">
      {/* Jumbotron with SVG Animation */}
      <SvgAnimation />

      {/* Hero Section */}
      <section className="mt-6 sm:mt-8">
        <h1 className="text-2xl sm:text-4xl font-bold leading-snug">
          {dict.home.hero?.title ?? dict.home.title}
        </h1>
        <p className="mt-3 text-foreground/80 text-base sm:text-lg">
          {dict.home.hero?.tagline ?? dict.home.welcome}
        </p>
        <p className="mt-2 text-foreground/80 text-base sm:text-lg">
          {dict.home.hero?.description}
        </p>
        <p className="mt-2 text-foreground/90 font-medium">
          {dict.home.hero?.cta}
        </p>
      </section>
    </main>
  );
}
