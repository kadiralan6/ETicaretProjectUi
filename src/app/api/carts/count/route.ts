import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { CART_GET_ITEM_COUNT } from "@/constants/apiEndpoints";

// GET /api/carts/count → GET /api/basket/carts/getItemCount/{userId}
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await httpClient.get(`${CART_GET_ITEM_COUNT}`);
    // Unwrap backend envelope: { isSuccess, statusCode, data: ICartItemCount }
    return NextResponse.json(response.data?.data ?? response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: error.response?.status || 500,
    });
  }
}
