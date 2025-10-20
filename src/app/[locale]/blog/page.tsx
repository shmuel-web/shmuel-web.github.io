import Link from "next/link";
import { listPostsForLocale } from "@/lib/markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
	return (["en", "he"] as const).map((locale) => ({ locale }));
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: "en" | "he" }> }) {
	const { locale } = await params;
	const posts = listPostsForLocale(locale)
		.filter((p) => !(p.frontmatter.draft === true))
		.sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date));
	return (
		<main className="max-w-screen-sm mx-auto w-full px-4 sm:px-6 md:px-8 py-8">
			<h1 className="text-2xl sm:text-3xl font-bold">{locale === "he" ? "בלוג" : "Blog"}</h1>
			<ul className="mt-6 space-y-6">
				{posts.map((p) => (
					<li key={`${p.post_number}-${locale}`} className="border-b pb-4">
						<Link href={`/${locale}/blog/${p.post_number}`} className="text-base sm:text-lg font-medium">
							{p.frontmatter.title}
						</Link>
						<div className="text-xs opacity-70 mt-1">
							{new Date(p.frontmatter.date).toLocaleDateString(locale)}
						</div>
						{p.frontmatter.summary && (
							<p className="text-sm mt-2">{p.frontmatter.summary}</p>
						)}
					</li>
				))}
			</ul>
		</main>
	);
}
