import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALLFILTER_PRODUCTS, CREATE_PRODUCT } from "@/constants/apiEndpoints";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const response = await httpClient.get(GET_ALLFILTER_PRODUCTS, { params });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(CREATE_PRODUCT, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
