import { NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { CREATE_BRAND } from "@/constants/apiEndpoints";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await httpClient.post(CREATE_BRAND, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Brand Create proxy error:", error?.response?.data || error.message);
    return NextResponse.json(
      { error: "Marka oluşturulurken bir sorun oluştu." },
      { status: error.response?.status || 500 }
    );
  }
}
