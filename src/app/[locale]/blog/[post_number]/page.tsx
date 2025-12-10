import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, listPostNumbers, getLocalesForPost } from "@/lib/markdown";
import Giscus from "@/app/components/Giscus";
import EditPostInline from "@/app/components/EditPostInline";
import AudioPlayer from "@/app/components/AudioPlayer";

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
	const ids = listPostNumbers();
	const params: Array<{ locale: "en" | "he"; post_number: string }> = [];
	ids.forEach((id) => {
		const locales = getLocalesForPost(id);
		locales.forEach((locale) => params.push({ locale, post_number: id }));
	});
	return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; post_number: string }> }): Promise<Metadata> {
  const { locale, post_number } = await params;
	const post = await getPost(locale, post_number);
	if (!post) return {};
	const alternates = {
		languages: {
			en: `/en/blog/${post_number}`,
			he: `/he/blog/${post_number}`,
		},
	};
	return {
		title: post.frontmatter.title,
		description: post.frontmatter.summary,
		alternates,
		openGraph: {
			type: "article",
			title: post.frontmatter.title,
			description: post.frontmatter.summary,
			locale,
		},
	};
}

export default async function BlogPostPage({ params, searchParams }: { params: Promise<{ locale: string; post_number: string }>; searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { locale, post_number } = await params;
  const sp = searchParams ? await searchParams : {};
  const isEdit = sp && Object.prototype.hasOwnProperty.call(sp, "edit");
  const post = await getPost(locale, post_number);
  if (!post) notFound();
  return (
        <article className="max-w-screen-sm mx-auto w-full px-4 sm:px-6 md:px-8 py-8" dir={locale === "he" ? "rtl" : "ltr"}>
            <h1 className="text-2xl sm:text-3xl font-bold">{post.frontmatter.title}</h1>
            <p className="text-xs sm:text-sm opacity-70 mt-2">
                {new Date(post.frontmatter.date).toLocaleDateString(locale)}
            </p>
            <AudioPlayer postNumber={post_number} locale={locale as "en" | "he"} />
            {isEdit ? (
                <EditPostInline initialHtml={post.html} initialMarkdown={post.markdown} dir={locale === "he" ? "rtl" : "ltr"} locale={locale} />
            ) : (
                <div className="prose dark:prose-invert mt-6" dangerouslySetInnerHTML={{ __html: post.html }} />
            )}
            <Giscus locale={locale} />
        </article>
    );
}



