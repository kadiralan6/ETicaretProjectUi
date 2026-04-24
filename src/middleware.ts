import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["tr", "en"];
const DEFAULT_LOCALE = "tr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, admin, Next.js internals, and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/robots") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if locale already present
  const hasLocale = LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!hasLocale) {
    // Detect preferred locale from Accept-Language header
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferred = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().slice(0, 2))
      .find((lang) => LOCALES.includes(lang));

    const locale = preferred || DEFAULT_LOCALE;

    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
