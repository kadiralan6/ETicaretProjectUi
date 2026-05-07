import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { CART_CLEAR } from "@/constants/apiEndpoints";

// DELETE /api/carts/clear → DELETE /api/basket/CartItems/clear
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await httpClient.delete(CART_CLEAR);
    return NextResponse.json(response.data?.data ?? response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: error.response?.status || 500,
    });
  }
}
