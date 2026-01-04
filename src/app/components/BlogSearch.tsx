"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Frontmatter } from "@/lib/markdown";

type Post = {
  post_number: string;
  frontmatter: Frontmatter;
};

type BlogSearchProps = {
  posts: Post[];
  locale: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onTopicClick: (topic: string) => void;
  dict: {
    searchPlaceholder: string;
    articles: string;
    topics: string;
    noResults: string;
  };
};

export default function BlogSearch({
  posts,
  locale,
  searchValue,
  onSearchChange,
  onTopicClick,
  dict,
}: BlogSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get all unique topics from posts
  const allTopics = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.tags || []))
  ).sort();

  // Filter posts and topics based on search
  const searchLower = searchValue.toLowerCase().trim();
  const matchingPosts = searchLower
    ? posts.filter(
        (post) =>
          post.frontmatter.title?.toLowerCase().includes(searchLower) ||
          post.frontmatter.summary?.toLowerCase().includes(searchLower)
      )
    : [];
  
  const matchingTopics = searchLower
    ? allTopics.filter((topic) => topic.toLowerCase().includes(searchLower))
    : allTopics.slice(0, 8); // Show first 8 topics when no search

  const hasResults = matchingPosts.length > 0 || matchingTopics.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handlePostClick = (postNumber: string) => {
    setIsOpen(false);
    onSearchChange("");
    router.push(`/${locale}/blog/${postNumber}`);
  };

  const handleTopicClick = (topic: string) => {
    setIsOpen(false);
    onSearchChange("");
    onTopicClick(topic);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = matchingPosts.length + matchingTopics.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      if (highlightedIndex < matchingPosts.length) {
        handlePostClick(matchingPosts[highlightedIndex].post_number);
      } else {
        const topicIndex = highlightedIndex - matchingPosts.length;
        handleTopicClick(matchingTopics[topicIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isRTL = locale === "he";

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={dict.searchPlaceholder}
          dir={isRTL ? "rtl" : "ltr"}
          className={`w-full px-4 py-3 ${isRTL ? "pl-10" : "pr-10"} rounded-2xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 text-sm`}
        />
        <div className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 pointer-events-none`}>
          <svg
            className="w-5 h-5 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isOpen && (searchValue || !searchValue) && (
        <div 
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {!hasResults && searchValue && (
            <div className="px-4 py-8 text-center text-sm opacity-60">
              {dict.noResults}
            </div>
          )}

          {matchingPosts.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold opacity-60 uppercase">
                {dict.articles}
              </div>
              {matchingPosts.map((post, idx) => (
                <button
                  key={post.post_number}
                  onClick={() => handlePostClick(post.post_number)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:bg-gray-200 dark:active:bg-gray-600 touch-manipulation ${
                    highlightedIndex === idx ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                >
                  <div className="font-medium text-sm">
                    {post.frontmatter.title}
                  </div>
                  {post.frontmatter.summary && (
                    <div className="text-xs opacity-60 mt-1 line-clamp-2">
                      {post.frontmatter.summary}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {matchingTopics.length > 0 && (
            <div className="py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 text-xs font-semibold opacity-60 uppercase">
                {dict.topics}
              </div>
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {matchingTopics.map((topic, idx) => {
                    const itemIdx = matchingPosts.length + idx;
                    return (
                      <button
                        key={topic}
                        onClick={() => handleTopicClick(topic)}
                        className={`px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs transition-colors active:scale-95 touch-manipulation ${
                          highlightedIndex === itemIdx
                            ? "ring-2 ring-gray-400 dark:ring-gray-500"
                            : ""
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

