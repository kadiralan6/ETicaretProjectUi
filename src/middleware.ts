import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["tr", "en"];
const DEFAULT_LOCALE = "tr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes, admin ve Next.js internal route'ları atla
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Pathname'de zaten locale var mı?
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
