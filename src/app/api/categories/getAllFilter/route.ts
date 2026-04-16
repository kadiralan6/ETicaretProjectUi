import { NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALL_CATEGORIES } from "@/constants/apiEndpoints";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const response = await httpClient.get(GET_ALL_CATEGORIES, { params });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Categories getAll proxy error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Kategoriler yüklenirken bir sorun oluştu." },
      { status: error.response?.status || 500 }
    );
  }
}
