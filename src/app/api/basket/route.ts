import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_BASKET, ADD_TO_BASKET } from "@/constants/apiEndpoints";

export async function GET() {
  try {
    const response = await httpClient.get(GET_BASKET);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(ADD_TO_BASKET, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
