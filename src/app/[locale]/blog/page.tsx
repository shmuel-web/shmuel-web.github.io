import { listPostsForLocale } from "@/lib/markdown";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/locales";
import type { Metadata } from "next";
import BlogClient from "@/app/components/BlogClient";
import NewsletterSubscribe from "@/app/components/NewsletterSubscribe";

export const dynamicParams = false;

export async function generateStaticParams() {
	return (["en", "he"] as const).map((locale) => ({ locale }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  
  return {
    title: dict.blog.title,
    other: {
      'follow.it-verification-code': locale === 'he' ? 'QRk0xmQAwpLgXNx4Jpqk' : 'HLzxBeb1pv5FYC2hzaZr'
    }
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const posts = listPostsForLocale(locale);

  return (
    <>
      <BlogClient
        posts={posts}
        locale={locale}
        dict={{
          title: locale === "he" ? "בלוג" : "Blog",
          searchPlaceholder: dict.blog.searchPlaceholder,
          articles: dict.blog.articles,
          topics: dict.blog.topics,
          noResults: dict.blog.noResults,
          clearAll: dict.blog.clearAll,
        }}
      />
      <div className="max-w-screen-sm mx-auto w-full px-4 sm:px-6 md:px-8">
        <NewsletterSubscribe
          locale={locale as Locale}
          heading={dict.newsletter.heading}
          promise={dict.newsletter.promise}
          emailPlaceholder={dict.newsletter.emailPlaceholder}
          submit={dict.newsletter.submit}
          formAction={dict.newsletter.formAction}
        />
      </div>
    </>
  );
}
