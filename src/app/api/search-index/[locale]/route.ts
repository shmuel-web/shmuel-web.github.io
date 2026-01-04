import { listPostsWithContentForLocale } from '@/lib/markdown';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const posts = listPostsWithContentForLocale(locale);
  
  return Response.json(
    posts.map(p => ({
      post_number: p.post_number,
      title: p.frontmatter.title,
      summary: p.frontmatter.summary,
      content: p.content,
      tags: p.frontmatter.tags,
      draft: p.frontmatter.draft
    }))
  );
}

