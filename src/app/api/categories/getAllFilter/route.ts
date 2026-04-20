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
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
