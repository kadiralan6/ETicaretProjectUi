import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { USER_CHANGE_PASSWORD } from "@/constants/apiEndpoints";

/**
 * PUT /api/profile/password → Backend PUT /api/identity/users/changePassword/{id}
 * Kullanıcı şifresini değiştirir.
 */
export async function PUT(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const response = await httpClient.put(USER_CHANGE_PASSWORD(userId), body);
    const result = response.data;

    if (result?.isSuccess) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { message: result?.message || "Şifre değiştirme başarısız." },
      { status: result?.statusCode || 400 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0];
    return NextResponse.json(
      { message: backendMsg || "Şifre değiştirilemedi." },
      { status },
    );
  }
}
