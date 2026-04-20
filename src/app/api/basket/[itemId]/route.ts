import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { REMOVE_FROM_BASKET } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ itemId: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { itemId } = await params;
  try {
    const response = await httpClient.delete(`${REMOVE_FROM_BASKET}/${itemId}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
