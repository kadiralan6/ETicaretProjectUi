import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { ADDRESS_GET_BY_USER, ADDRESS_CREATE } from "@/constants/apiEndpoints";

/**
 * GET /api/addresses → Backend GET /api/identity/addresses/getByUser
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await httpClient.get(ADDRESS_GET_BY_USER);
    const body = response.data;

    if (body?.isSuccess) {
      return NextResponse.json(body.data);
    }

    return NextResponse.json(
      { message: body?.message || "Adresler yüklenemedi." },
      { status: body?.statusCode || 400 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const msg = error.response?.data?.message;
    return NextResponse.json(
      { message: msg || "Adresler yüklenemedi." },
      { status },
    );
  }
}

/**
 * POST /api/addresses → Backend POST /api/identity/addresses/create
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const response = await httpClient.post(ADDRESS_CREATE, body);
    const result = response.data;

    if (result?.isSuccess) {
      return NextResponse.json(result.data, { status: 201 });
    }

    return NextResponse.json(
      { message: result?.message || "Adres oluşturulamadı." },
      { status: result?.statusCode || 400 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const msg =
      error.response?.data?.message || error.response?.data?.errors?.[0];
    return NextResponse.json(
      { message: msg || "Adres oluşturulamadı." },
      { status },
    );
  }
}
