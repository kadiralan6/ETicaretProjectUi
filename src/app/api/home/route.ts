import { NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { GET_HOME_DATA } from "@/constants/apiEndpoints";

export async function GET() {
  try {
    const response = await httpClient.get(GET_HOME_DATA);
    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, { status: errorData.StatusCode || 500 });
  }
}
