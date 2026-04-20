import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_ORDER_BY_ID } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${GET_ORDER_BY_ID}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
