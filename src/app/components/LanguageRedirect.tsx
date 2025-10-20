"use client";

import { useEffect } from "react";

interface LanguageRedirectProps {
  currentLocale: string;
}

export default function LanguageRedirect({ currentLocale }: LanguageRedirectProps) {
  useEffect(() => {
    // Check if user has a saved preference
    const stored = localStorage.getItem('preferredLocale');
    if (stored) {
      // User has set a preference, respect it
      if (stored !== currentLocale) {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(`/${currentLocale}/`, `/${stored}/`);
        window.location.replace(newPath);
      }
      return;
    }

    // No preference set, check browser language
    const browserLang = navigator.language || navigator.languages?.[0];
    const prefersEnglish = browserLang?.toLowerCase().startsWith('en');
    
    // Only redirect if browser preference differs from current locale
    if (prefersEnglish && currentLocale === 'he') {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace('/he/', '/en/');
      window.location.replace(newPath);
    } else if (!prefersEnglish && currentLocale === 'en') {
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace('/en/', '/he/');
      window.location.replace(newPath);
    }
  }, [currentLocale]);

  return null; // This component doesn't render anything
}
