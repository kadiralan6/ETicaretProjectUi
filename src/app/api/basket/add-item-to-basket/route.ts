import { ADD_TO_BASKET } from "@/constants/apiEndpoints";
import httpClient from "@/util/httpClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();

    // Simulate latency for mock
    // const response = await httpClient.post(ADD_TO_BASKET, body);

    console.log("Mock API Route: Sending to Backend ->", ADD_TO_BASKET, body);

    // MOCK RESPONSE (to be replaced with actual backend response)
    const mockData = {
      success: true,
      message: "Ürün sepete eklendi.",
      data: {
        basketId: "mock-123",
        itemsCount: 1
      }
    };

    return NextResponse.json(mockData);
  } catch (error: any) {
    const errorData = error.response?.data || { message: "Internal Server Error" };
    return NextResponse.json(errorData, {
      status: errorData.StatusCode || 500,
    });
  }
}
