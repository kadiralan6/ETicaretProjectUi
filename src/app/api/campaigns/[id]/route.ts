import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import {
  CAMPAIGN_GET_BY_ID,
  CAMPAIGN_UPDATE,
  CAMPAIGN_DELETE,
} from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.get(`${CAMPAIGN_GET_BY_ID}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const response = await httpClient.put(CAMPAIGN_UPDATE, {
      ...body,
      id: Number(id),
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const response = await httpClient.delete(`${CAMPAIGN_DELETE}/${id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}
