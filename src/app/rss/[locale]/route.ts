import RSS from 'rss';
import { listPostsWithContentForLocale } from '@/lib/markdown';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'he' }];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  
  // Site configuration
  const siteUrl = 'https://shmuel-web.github.io';
  const siteTitle = locale === 'he' ? 'בין העולמות' : 'Between Worlds';
  const siteDescription = locale === 'he' 
    ? 'כתיבה, הערות ורעיונות.' 
    : 'Writing, notes, and ideas.';

  const feed = new RSS({
    title: siteTitle,
    description: siteDescription,
    feed_url: `${siteUrl}/rss/${locale}.xml`,
    site_url: siteUrl,
    language: locale,
    pubDate: new Date(),
  });

  // Get all posts for this locale
  const posts = listPostsWithContentForLocale(locale);

  // Sort posts by date (newest first) and filter out drafts
  const sortedPosts = posts
    .filter(post => !post.frontmatter.draft)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateB - dateA;
    });

  // Add each post to the feed
  sortedPosts.forEach(post => {
    const postUrl = `${siteUrl}/${locale}/blog/${post.post_number}`;
    
    // Use summary if available, otherwise first 200 characters of content
    const description = post.frontmatter.summary || 
      (post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''));
    
    feed.item({
      title: post.frontmatter.title,
      description: description,
      url: postUrl,
      guid: postUrl,
      date: new Date(post.frontmatter.date),
      categories: post.frontmatter.tags || [],
    });
  });

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

