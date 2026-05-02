import { NextRequest, NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_HOME_DATA } from "@/constants/apiEndpoints";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: "1",
      pageSize: "4",
      OrderBy: "0",
      orderType: "0",
      ...Object.fromEntries(searchParams.entries()),
    };

    const response = await httpClient.get(GET_HOME_DATA, { params });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
