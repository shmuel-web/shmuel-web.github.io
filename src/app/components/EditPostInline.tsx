"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TurndownService from "turndown";

type Props = {
  initialHtml: string;
  initialMarkdown: string;
  dir: "rtl" | "ltr";
  locale: string;
};

export default function EditPostInline({ initialHtml, initialMarkdown, dir, locale }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [copied, setCopied] = useState<boolean>(false);

  const turndown = useMemo(() => {
    const td = new TurndownService({
      codeBlockStyle: "fenced",
      emDelimiter: "_",
      headingStyle: "atx",
      bulletListMarker: "-",
    });
    return td;
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = initialHtml;
  }, [initialHtml]);

  useEffect(() => {
    if (!editorRef.current) return;
    const el = editorRef.current;

    const handle = () => {
      const html = el.innerHTML;
      const md = turndown.turndown(html);
      setMarkdown(md);
    };

    el.addEventListener("input", handle);
    el.addEventListener("blur", handle);
    return () => {
      el.removeEventListener("input", handle);
      el.removeEventListener("blur", handle);
    };
  }, [turndown]);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="mt-6 space-y-4" dir={dir}>
      <div
        ref={editorRef}
        className="prose dark:prose-invert rounded-md border border-dashed border-gray-300 dark:border-gray-700 p-3 focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        style={{ wordBreak: "break-word" }}
      />

      <div className="rounded-md border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm opacity-80">{locale === "he" ? "Markdown" : "Markdown"}</span>
          <button
            type="button"
            onClick={copyMarkdown}
            className="text-xs px-2 py-1 rounded bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
          >
            {copied ? (locale === "he" ? "הועתק!" : "Copied!") : (locale === "he" ? "העתק" : "Copy")}
          </button>
        </div>
        <textarea
          readOnly
          value={markdown}
          dir={dir}
          className="w-full p-3 text-xs sm:text-sm bg-transparent outline-none resize-y min-h-[180px]"
        />
      </div>
    </div>
  );
}


