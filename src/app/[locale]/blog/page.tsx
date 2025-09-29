"use client";

import ComingSoon from "@/app/components/ComingSoon";
import { useI18n } from "@/i18n/I18nProvider";

export default function BlogPage() {
  const { dict } = useI18n();
  return (
    <main className="max-w-2xl mx-auto w-full p-8 sm:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold">{dict.blog.title}</h1>
      <p className="mt-3 text-foreground/80">{dict.blog.description}</p>
      <ComingSoon />
    </main>
  );
}
