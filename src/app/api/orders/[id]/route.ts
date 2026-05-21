import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ORDER_DETAIL } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type AxiosLike = { response?: { data?: Record<string, unknown>; status?: number } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${GET_ORDER_DETAIL}/${id}`);
    const result = response.data;
    return NextResponse.json(result?.data ?? result);
  } catch (error) {
    const err = error as AxiosLike;
    const errorData = err.response?.data || {};
    return NextResponse.json(errorData, {
      status: (errorData.statusCode as number) || 500,
    });
  }
}
