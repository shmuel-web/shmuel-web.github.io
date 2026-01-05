"use client";

import { useEffect, useRef, useState } from "react";

interface GiscusProps {
	locale: string;
	noCommentsMessage: string;
}

/**
 * Determines the effective theme by checking data-theme attribute or system preference
 */
function getEffectiveTheme(): "light" | "dark" {
	const root = document.documentElement;
	const explicitTheme = root.getAttribute("data-theme");
	
	if (explicitTheme === "light" || explicitTheme === "dark") {
		return explicitTheme;
	}
	
	// System mode - check prefers-color-scheme
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	return prefersDark ? "dark" : "light";
}

/**
 * Updates Giscus theme using postMessage API
 */
function changeGiscusTheme(theme: "light" | "dark") {
	const iframe = document.querySelector("iframe.giscus-frame") as HTMLIFrameElement | null;
	if (!iframe?.contentWindow) return;
	
	iframe.contentWindow.postMessage(
		{ giscus: { setConfig: { theme } } },
		"https://giscus.app"
	);
}


export default function Giscus({ locale, noCommentsMessage }: GiscusProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [commentCount, setCommentCount] = useState<number | null>(null);
	const [showComments, setShowComments] = useState(false);

	// Effect to load Giscus script
	useEffect(() => {
		if (!containerRef.current) return;

		// Clear any existing content
		containerRef.current.innerHTML = "";

		// Create script element
		const script = document.createElement("script");
		script.src = "https://giscus.app/client.js";
		script.setAttribute("data-repo", "shmuel-web/shmuel-web.github.io");
		script.setAttribute("data-repo-id", "MDEwOlJlcG9zaXRvcnkzOTEyMjM1Ng==");
		script.setAttribute("data-category", "General");
		script.setAttribute("data-category-id", "DIC_kwDOAlT1tM4CxOCL");
		script.setAttribute("data-mapping", "pathname");
		script.setAttribute("data-strict", "0");
		script.setAttribute("data-reactions-enabled", "0");
		script.setAttribute("data-emit-metadata", "1");
		script.setAttribute("data-input-position", "bottom");
		script.setAttribute("data-theme", "preferred_color_scheme");
		script.setAttribute("data-lang", locale);
		script.setAttribute("crossorigin", "anonymous");
		script.async = true;

		// Sync initial theme after script loads
		script.onload = () => {
			// Small delay to ensure iframe is ready
			setTimeout(() => {
				const theme = getEffectiveTheme();
				changeGiscusTheme(theme);
			}, 100);
		};

		containerRef.current.appendChild(script);

		// Cleanup function
		return () => {
			if (containerRef.current && containerRef.current.contains(script)) {
				containerRef.current.removeChild(script);
			}
		};
	}, [locale]);

	// Effect to listen for Giscus metadata messages
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			// Only accept messages from Giscus
			if (event.origin !== "https://giscus.app") return;
			
			// Check if this is a metadata message
			if (event.data?.giscus?.discussion) {
				const discussion = event.data.giscus.discussion;
				// Try different properties that might contain comment count
				const count = discussion.totalCommentCount ?? discussion.reactionCount ?? 0;
				setCommentCount(count);
				// If there are comments, show the comment section automatically
				if (count > 0) {
					setShowComments(true);
				}
			}
		};

		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	// Effect to watch for theme changes
	useEffect(() => {
		const root = document.documentElement;
		
		// MutationObserver for data-theme attribute changes
		const themeObserver = new MutationObserver(() => {
			const theme = getEffectiveTheme();
			changeGiscusTheme(theme);
		});

		themeObserver.observe(root, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		// Media query listener for system preference changes (when in system mode)
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleMediaChange = () => {
			// Only update if we're in system mode (no explicit data-theme)
			if (!root.hasAttribute("data-theme")) {
				const theme = getEffectiveTheme();
				changeGiscusTheme(theme);
			}
		};

		mediaQuery.addEventListener("change", handleMediaChange);

		// Cleanup
		return () => {
			themeObserver.disconnect();
			mediaQuery.removeEventListener("change", handleMediaChange);
		};
	}, []);

	return (
		<div className="mt-8">
			{/* Show custom message when no comments and comments section is hidden */}
			{(commentCount === null || commentCount === 0) && !showComments && (
				<div className="py-6">
					<p className="text-base text-gray-700 dark:text-gray-300">
						{noCommentsMessage}{' '}
						<button
							onClick={() => setShowComments(true)}
							className="inline font-semibold underline decoration-2 underline-offset-4 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
						>
							{locale === 'he' ? 'התגובה הראשונה' : 'first comment'}
						</button>
					</p>
				</div>
			)}
			{/* Always render the container, but hide it when showing the empty state message */}
			<div ref={containerRef} style={{ display: (!showComments && (commentCount === null || commentCount === 0)) ? 'none' : 'block' }} />
		</div>
	);
}

