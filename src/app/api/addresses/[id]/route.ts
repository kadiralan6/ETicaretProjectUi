import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import {
  ADDRESS_GET_BY_ID,
  ADDRESS_UPDATE,
  ADDRESS_DELETE,
} from "@/constants/apiEndpoints";

/**
 * GET /api/addresses/[id] → Backend GET /api/identity/addresses/getById/{id}
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const response = await httpClient.get(ADDRESS_GET_BY_ID(id));
    const body = response.data;

    if (body?.isSuccess) {
      return NextResponse.json(body.data);
    }

    return NextResponse.json(
      { message: body?.message || "Adres bulunamadı." },
      { status: body?.statusCode || 404 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const msg = error.response?.data?.message;
    return NextResponse.json(
      { message: msg || "Adres yüklenemedi." },
      { status },
    );
  }
}

/**
 * PUT /api/addresses/[id] → Backend PUT /api/identity/addresses/update/{id}
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const response = await httpClient.put(ADDRESS_UPDATE(id), body);
    const result = response.data;

    if (result?.isSuccess) {
      return NextResponse.json(result.data);
    }

    return NextResponse.json(
      { message: result?.message || "Adres güncellenemedi." },
      { status: result?.statusCode || 400 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const msg =
      error.response?.data?.message || error.response?.data?.errors?.[0];
    return NextResponse.json(
      { message: msg || "Adres güncellenemedi." },
      { status },
    );
  }
}

/**
 * DELETE /api/addresses/[id] → Backend DELETE /api/identity/addresses/delete/{id}
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const response = await httpClient.delete(ADDRESS_DELETE(id));
    const result = response.data;

    if (result?.isSuccess) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { message: result?.message || "Adres silinemedi." },
      { status: result?.statusCode || 400 },
    );
  } catch (error: any) {
    const status = error.response?.status || 500;
    const msg = error.response?.data?.message;
    return NextResponse.json(
      { message: msg || "Adres silinemedi." },
      { status },
    );
  }
}
