import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ALL_ORDERS, PLACE_ORDER } from "@/constants/apiEndpoints";

export async function GET() {
  try {
    const response = await httpClient.get(GET_ALL_ORDERS);
    return NextResponse.json(response.data?.data ?? response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await httpClient.post(PLACE_ORDER, body);
    const result = response.data;

    if (result?.isSuccess === false) {
      return NextResponse.json(
        { message: result.message, errors: result.errors },
        { status: result.statusCode || 400 },
      );
    }

    return NextResponse.json(result?.data ?? result);
  } catch (error: any) {
    const errorData = error.response?.data;
    const status = error.response?.status || 500;
    return NextResponse.json(
      { message: errorData?.message || "Sipariş oluşturulamadı." },
      { status },
    );
  }
}
