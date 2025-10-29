"use client";

import { useEffect, useRef } from "react";

interface GiscusProps {
	locale: string;
}

export default function Giscus({ locale }: GiscusProps) {
	const containerRef = useRef<HTMLDivElement>(null);

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

		containerRef.current.appendChild(script);

		// Cleanup function
		return () => {
			if (containerRef.current && containerRef.current.contains(script)) {
				containerRef.current.removeChild(script);
			}
		};
	}, [locale]);

	return <div ref={containerRef} className="mt-8" />;
}

