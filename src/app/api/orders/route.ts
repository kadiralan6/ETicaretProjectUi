import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_MY_ORDERS, PLACE_ORDER } from "@/constants/apiEndpoints";

type AxiosLike = { response?: { data?: Record<string, unknown>; status?: number } };

export async function GET() {
  try {
    const response = await httpClient.get(GET_MY_ORDERS);
    const result = response.data;
    return NextResponse.json(result?.data ?? result);
  } catch (error) {
    const err = error as AxiosLike;
    const errorData = err.response?.data || {};
    return NextResponse.json(errorData, {
      status: (errorData.StatusCode as number) || 500,
    });
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
  } catch (error) {
    const err = error as AxiosLike;
    const errorData = err.response?.data;
    const status = (err.response?.status as number) || 500;
    return NextResponse.json(
      { message: (errorData?.message as string) || "Sipariş oluşturulamadı." },
      { status },
    );
  }
}
