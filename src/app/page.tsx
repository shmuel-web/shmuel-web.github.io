import Footer from "./components/Footer";
import Header from "./components/Header";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary } from "@/i18n/getDictionary";
import SvgAnimation from "./components/SvgAnimation";
import type { Locale } from "@/i18n/locales";

export default async function RootPage() {
  const locale: Locale = "he"; // Default to Hebrew
  const dict = await getDictionary(locale);

  return (
    <I18nProvider value={{ locale, dict }}>
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]" dir="rtl">
        <Header />
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
        <Footer />
      </div>
    </I18nProvider>
  );
}
