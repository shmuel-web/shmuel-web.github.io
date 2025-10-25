import Footer from "../components/Footer";
import Header from "../components/Header";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/locales";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "he" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      languages: {
        'he': '/he/',
        'en': '/en/',
        'x-default': '/he/'
      }
    },
    title: locale === 'he' ? 'בלוג שלי' : 'My Blog'
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <I18nProvider value={{ locale, dict }}>
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]" dir={locale === "he" ? "rtl" : "ltr"}>
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </I18nProvider>
  );
}
