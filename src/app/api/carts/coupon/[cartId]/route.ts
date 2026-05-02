import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { CART_REMOVE_COUPON } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ cartId: string }>;
}

// DELETE /api/carts/coupon/{cartId} → DELETE /api/basket/carts/removeCoupon/{userId}/{cartId}
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { cartId } = await params;
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await httpClient.delete(
      `${CART_REMOVE_COUPON}/${userId}/${cartId}`,
    );
    return NextResponse.json(response.data?.data ?? response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: error.response?.status || 500,
    });
  }
}
