import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_BRAND_BY_ID, UPDATE_BRAND, DELETE_BRAND } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${GET_BRAND_BY_ID}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const response = await httpClient.put(UPDATE_BRAND, { id, ...body });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.delete(`${DELETE_BRAND}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
