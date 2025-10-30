import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

export type Locale = "en" | "he";

export type Frontmatter = {
	post_number: number;
	title: string;
	date: string;
	summary?: string;
	tags?: string[];
	draft?: boolean;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "blog");

export function listPostNumbers(): string[] {
	if (!fs.existsSync(CONTENT_ROOT)) return [];
	return fs
		.readdirSync(CONTENT_ROOT)
		.filter((entry) => fs.statSync(path.join(CONTENT_ROOT, entry)).isDirectory())
		.sort();
}

export function getLocalesForPost(postNumber: string): Locale[] {
	const locales: Locale[] = [];
	(["en", "he"] as const).forEach((loc) => {
		const filePath = path.join(CONTENT_ROOT, postNumber, `${loc}.md`);
		if (fs.existsSync(filePath)) locales.push(loc);
	});
	return locales;
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behavior: "wrap" })
		.use(rehypeStringify)
		.process(markdown);
	return String(file);
}

export type ParsedPost = {
	frontmatter: Frontmatter;
	html: string;
    markdown: string;
};

export async function getPost(locale: string, postNumber: string): Promise<ParsedPost | null> {
  const filePath = path.join(CONTENT_ROOT, postNumber, `${locale}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = await renderMarkdownToHtml(content);
  return { frontmatter: data as Frontmatter, html, markdown: content };
}

export function listPostsForLocale(locale: string): Array<{ post_number: string; frontmatter: Frontmatter }>{
  return listPostNumbers()
    .map((id) => {
      const filePath = path.join(CONTENT_ROOT, id, `${locale}.md`);
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      return { post_number: id, frontmatter: data as Frontmatter };
    })
    .filter(Boolean) as Array<{ post_number: string; frontmatter: Frontmatter }>;
}



