import { NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALLFILTER_BRANDS } from "@/constants/apiEndpoints";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Yönlendirilecek query parametrelerini hazırla (Page, PageSize, Search vb.)
    const params = Object.fromEntries(searchParams.entries());

    const response = await httpClient.get(GET_ALLFILTER_BRANDS, { params });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Brands API proxy error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Markalar yüklenirken bir sorun oluştu." },
      { status: error.response?.status || 500 }
    );
  }
}
