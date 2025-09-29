import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./i18n/locales";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.(png|jpg|jpeg|gif|svg|ico|css|js|txt|xml|webp|avif|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isMissingLocale = SUPPORTED_LOCALES.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (isMissingLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
