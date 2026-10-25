"use client";

import type { Locale } from "@/i18n/locales";
import Button from "./Button";

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
      className="w-full min-w-0 pt-8"
      dir={locale === "he" ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full min-w-0 mx-auto">
        <h3 className="text-lg font-semibold text-center mb-4">
          {heading}
        </h3>
        
        <form 
          action={formAction} 
          method="post"
          className="flex w-full min-w-0 flex-col gap-3"
        >
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <input
              type="email"
              name="email"
              placeholder={emailPlaceholder}
              required
              className="w-full min-w-0 flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color)] text-[var(--text-color)] placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              variant="solid"
              className="w-full sm:w-auto"
            >
              {submit}
            </Button>
          </div>
        </form>
        
        <p className="text-sm opacity-70 text-center mt-3">
          {promise}
        </p>
      </div>
    </div>
  );
}
