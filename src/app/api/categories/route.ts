import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALL_CATEGORIES, CREATE_CATEGORY } from "@/constants/apiEndpoints";

export async function GET() {
  try {
    const response = await httpClient.get(GET_ALL_CATEGORIES);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(CREATE_CATEGORY, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
