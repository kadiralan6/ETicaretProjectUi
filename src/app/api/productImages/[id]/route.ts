import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { DELETE_PRODUCT_IMAGE } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.delete(`${DELETE_PRODUCT_IMAGE}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
