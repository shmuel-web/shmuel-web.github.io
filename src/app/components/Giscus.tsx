"use client";

import { useEffect, useRef } from "react";

interface GiscusProps {
	locale: string;
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

export default function Giscus({ locale }: GiscusProps) {
	const containerRef = useRef<HTMLDivElement>(null);

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
		script.setAttribute("data-reactions-enabled", "1");
		script.setAttribute("data-emit-metadata", "0");
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

	return <div ref={containerRef} className="mt-8" />;
}

