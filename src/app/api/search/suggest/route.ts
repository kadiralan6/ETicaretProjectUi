import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const size = request.nextUrl.searchParams.get("size") || "5";

  if (!q.trim()) {
    return NextResponse.json({ isSuccess: true, data: [] });
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/search/suggest?q=${encodeURIComponent(q)}&size=${size}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return NextResponse.json({ isSuccess: true, data: [] });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ isSuccess: true, data: [] });
  }
}
