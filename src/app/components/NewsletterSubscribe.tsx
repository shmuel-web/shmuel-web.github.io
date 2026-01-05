"use client";

import type { Locale } from "@/i18n/locales";

interface NewsletterSubscribeProps {
  locale: Locale;
  heading: string;
  promise: string;
  emailPlaceholder: string;
  submit: string;
  formAction: string;
}

export default function NewsletterSubscribe({
  locale,
  heading,
  promise,
  emailPlaceholder,
  submit,
  formAction,
}: NewsletterSubscribeProps) {
  return (
    <div 
      className="pt-8" 
      dir={locale === "he" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-center mb-4">
          {heading}
        </h3>
        
        <form 
          action={formAction} 
          method="post"
          className="flex flex-col gap-3"
        >
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder={emailPlaceholder}
              required
              className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {submit}
            </button>
          </div>
        </form>
        
        <p className="text-sm opacity-70 text-center mt-3">
          {promise}
        </p>
      </div>
    </div>
  );
}

