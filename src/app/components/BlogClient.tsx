"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import BlogSearch from "@/app/components/BlogSearch";
import FilterChips from "@/app/components/FilterChips";
import type { Frontmatter } from "@/lib/markdown";

type Post = {
  post_number: string;
  frontmatter: Frontmatter;
};

type PostWithContent = {
  post_number: string;
  title: string;
  summary?: string;
  content: string;
  tags?: string[];
  draft?: boolean;
};

type BlogClientProps = {
  posts: Post[];
  locale: string;
  dict: {
    title: string;
    searchPlaceholder: string;
    articles: string;
    topics: string;
    noResults: string;
    clearAll: string;
  };
};

function BlogClientContent({ posts, locale, dict }: BlogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [postsWithContent, setPostsWithContent] = useState<PostWithContent[] | null>(null);

  // Parse URL params on mount
  useEffect(() => {
    const topicsParam = searchParams.get("topics");
    const searchParam = searchParams.get("search");

    if (topicsParam) {
      setSelectedTopics(topicsParam.split(",").filter(Boolean));
    }
    if (searchParam) {
      setSearchValue(searchParam);
      setSubmittedSearch(searchParam);
    }
  }, [searchParams]);

  // Load search index with full content when search is submitted
  useEffect(() => {
    const loadSearchIndex = async () => {
      if (postsWithContent || !submittedSearch.trim()) return; // Already loaded or no search
      
      try {
        const response = await fetch(`/api/search-index/${locale}`);
        const data = await response.json();
        setPostsWithContent(data);
      } catch (error) {
        console.error('Failed to load search index:', error);
      }
    };

    loadSearchIndex();
  }, [submittedSearch, locale, postsWithContent]);

  // Update URL when filters change
  const updateURL = useCallback(
    (topics: string[], search: string) => {
      const params = new URLSearchParams();
      
      if (topics.length > 0) {
        params.set("topics", topics.join(","));
      }
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const newURL = params.toString() 
        ? `${pathname}?${params.toString()}`
        : pathname;
      
      router.replace(newURL, { scroll: false });
    },
    [pathname, router]
  );

  // Update URL when submitted search or topics change
  useEffect(() => {
    updateURL(selectedTopics, submittedSearch);
  }, [selectedTopics, submittedSearch, updateURL]);

  const handleTopicAdd = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleTopicRemove = (topic: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  const handleClearAllTopics = () => {
    setSelectedTopics([]);
  };

  const handleSearchSubmit = () => {
    setSubmittedSearch(searchValue);
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter((p) => {
      // Filter out drafts
      if (p.frontmatter.draft === true) return false;

      // Filter by selected topics (post must have ALL selected topics)
      if (selectedTopics.length > 0) {
        const postTags = p.frontmatter.tags || [];
        const hasAllTopics = selectedTopics.every((topic) =>
          postTags.includes(topic)
        );
        if (!hasAllTopics) return false;
      }

      // Filter by search text (title, summary, or content if available)
      if (submittedSearch.trim()) {
        const searchLower = submittedSearch.toLowerCase();
        const matchesTitle = p.frontmatter.title
          ?.toLowerCase()
          .includes(searchLower);
        const matchesSummary = p.frontmatter.summary
          ?.toLowerCase()
          .includes(searchLower);
        
        // If content is loaded, also search through it
        let matchesContent = false;
        if (postsWithContent) {
          const postWithContent = postsWithContent.find(
            (pc) => pc.post_number === p.post_number
          );
          if (postWithContent) {
            matchesContent = postWithContent.content
              .toLowerCase()
              .includes(searchLower);
          }
        }
        
        if (!matchesTitle && !matchesSummary && !matchesContent) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Always sort by date, latest first (default)
      return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
    });

  const isRTL = locale === "he";

  return (
    <main className="max-w-screen-sm mx-auto w-full px-4 sm:px-6 md:px-8 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{dict.title}</h1>

      <div className="space-y-4 mb-6">
        <BlogSearch
          posts={posts.filter((p) => !(p.frontmatter.draft === true))}
          locale={locale}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          onTopicClick={handleTopicAdd}
          dict={{
            searchPlaceholder: dict.searchPlaceholder,
            articles: dict.articles,
            topics: dict.topics,
            noResults: dict.noResults,
          }}
        />

        <FilterChips
          topics={selectedTopics}
          onRemove={handleTopicRemove}
          onClearAll={handleClearAllTopics}
          dict={{ clearAll: dict.clearAll }}
          locale={locale}
        />
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 opacity-60">
          <p>{dict.noResults}</p>
        </div>
      )}

      <ul className="mt-6 space-y-6">
        {filteredPosts.map((p) => (
          <li key={`${p.post_number}-${locale}`} className="border-b pb-4">
            <Link
              href={`/${locale}/blog/${p.post_number}`}
              className="text-base sm:text-lg font-medium hover:underline"
            >
              {p.frontmatter.title}
            </Link>
            <div className="text-xs opacity-70 mt-1">
              {new Date(p.frontmatter.date).toLocaleDateString(locale)}
            </div>
            {p.frontmatter.summary && (
              <p className="text-sm mt-2">{p.frontmatter.summary}</p>
            )}
            {p.frontmatter.tags && p.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {p.frontmatter.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTopicAdd(tag);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95 touch-manipulation"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function BlogClient(props: BlogClientProps) {
  return (
    <Suspense fallback={<div className="max-w-screen-sm mx-auto w-full px-4 py-8">Loading...</div>}>
      <BlogClientContent {...props} />
    </Suspense>
  );
}

