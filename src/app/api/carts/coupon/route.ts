import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { CART_APPLY_COUPON } from "@/constants/apiEndpoints";

// POST /api/carts/coupon → POST /api/basket/CartItems/applyCoupon
// Body: { cartId, couponCode }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const response = await httpClient.post(CART_APPLY_COUPON, body);
    return NextResponse.json(response.data?.data ?? response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: error.response?.status || 500,
    });
  }
}
