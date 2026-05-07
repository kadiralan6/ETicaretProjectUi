import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { USER_GET_BY_ID, USER_UPDATE } from "@/constants/apiEndpoints";

/**
 * GET /api/profile → Backend GET /api/identity/users/getById/{id}
 * Oturumdaki kullanıcının profil bilgilerini döner.
 */
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await httpClient.get(USER_GET_BY_ID(userId));
    const body = response.data;

    if (body?.isSuccess) {
      return NextResponse.json(body.data);
    }

    return NextResponse.json(
      { message: body?.message || "Profil yüklenemedi." },
      { status: body?.statusCode || 400 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const backendMsg = error.response?.data?.message;
    return NextResponse.json(
      { message: backendMsg || "Profil yüklenemedi." },
      { status },
    );
  }
}

/**
 * PUT /api/profile → Backend PUT /api/identity/users/update/{id}
 * Kullanıcı bilgilerini günceller.
 */
export async function PUT(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const response = await httpClient.put(USER_UPDATE(userId), body);
    const result = response.data;

    if (result?.isSuccess) {
      return NextResponse.json(result.data);
    }

    return NextResponse.json(
      { message: result?.message || "Güncelleme başarısız." },
      { status: result?.statusCode || 400 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0];
    return NextResponse.json(
      { message: backendMsg || "Profil güncellenemedi." },
      { status },
    );
  }
}
