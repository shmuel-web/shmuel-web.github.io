import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export default function (phase: string): NextConfig {
  const commonConfig: NextConfig = {
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  };

  if (phase === PHASE_PRODUCTION_BUILD) {
    return {
      ...commonConfig,
      // Enable static export only for production builds
      output: "export",
    } as NextConfig;
  }

  // In dev, do not use static export so middleware works
  return commonConfig;
}
