import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { CART_UPDATE_ITEM, CART_REMOVE_ITEM } from "@/constants/apiEndpoints";

interface RouteParams {
  params: Promise<{ cartItemId: string }>;
}

// PUT /api/carts/items/{cartItemId} → PUT /api/basket/CartItems/updateItem
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { cartItemId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const response = await httpClient.put(CART_UPDATE_ITEM, {
      cartItemId: Number(cartItemId),
      quantity: body.quantity,
      couponId: body.couponId ?? 0,
    });
    return NextResponse.json(response.data?.data ?? response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: error.response?.status || 500,
    });
  }
}

// DELETE /api/carts/items/{cartItemId} → DELETE /api/basket/CartItems/removeItem/{cartItemId}
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
) {
  const { cartItemId } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await httpClient.delete(
      `${CART_REMOVE_ITEM}/${cartItemId}`,
    );
    return NextResponse.json(response.data?.data ?? response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    return NextResponse.json(errorData, {
      status: error.response?.status || 500,
    });
  }
}
