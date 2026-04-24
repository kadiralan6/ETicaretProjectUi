import { NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { CREATE_CATEGORY } from "@/constants/apiEndpoints";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await httpClient.post(CREATE_CATEGORY, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
