import { listPostsForLocale } from "@/lib/markdown";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/locales";
import type { Metadata } from "next";
import BlogClient from "@/app/components/BlogClient";

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
    title: dict.blog.title
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const posts = listPostsForLocale(locale);

  return (
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
  );
}
