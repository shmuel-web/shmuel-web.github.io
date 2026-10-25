"use client";

type FilterChipsProps = {
  topics: string[];
  onRemove: (topic: string) => void;
  onClearAll: () => void;
  dict: {
    clearAll: string;
  };
  locale: string;
};

export default function FilterChips({
  topics,
  onRemove,
  onClearAll,
  dict,
  locale,
}: FilterChipsProps) {
  if (topics.length === 0) return null;

  const isRTL = locale === "he";

  return (
    <div className="flex flex-wrap gap-2 items-center" dir={isRTL ? "rtl" : "ltr"}>
      {topics.map((topic) => (
        <div
          key={topic}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-sm"
        >
          <span>{topic}</span>
          <button
            onClick={() => onRemove(topic)}
            className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-1 transition-colors active:scale-90 touch-manipulation"
            aria-label={`Remove ${topic} filter`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
      
      {topics.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm opacity-60 hover:opacity-100 underline transition-opacity py-1.5 px-2 touch-manipulation"
        >
          {dict.clearAll}
        </button>
      )}
    </div>
  );
}

