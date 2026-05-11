import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { AUTH_LOGOUT } from "@/constants/apiEndpoints";

// POST /api/auth/logout → POST /api/identity/auth/logout/{userId}
export async function POST() {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (userId) {
      await httpClient.post(AUTH_LOGOUT(userId));
    }

    return NextResponse.json({ success: true });
  } catch {
    // Logout backend hatası olsa bile client session'ı temizlenmeli
    return NextResponse.json({ success: true });
  }
}
