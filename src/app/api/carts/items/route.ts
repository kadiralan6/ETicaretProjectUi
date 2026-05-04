import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { CART_ADD_ITEM } from "@/constants/apiEndpoints";

// POST /api/carts/items → POST /api/basket/carts/addItem/{userId}
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
   
    const body = await request.json();
    const payload = {
      productId: Number(body.productId),
      quantity: Number(body.quantity),
      userId: Number(userId),
    };
    console.log("[addItem] userId:", userId, "token:", (session as any)?.accessToken?.token?.slice(0, 30) + "...");
    const response = await httpClient.post(CART_ADD_ITEM, payload);
    // Unwrap backend envelope: { isSuccess, statusCode, data: ICart }
    return NextResponse.json(response.data?.data ?? response.data, {
      status: 200,
    });
  } catch (error: any) {
    // Backend ApiResponse envelope: { isSuccess, message, statusCode, errors }
    const backendData = error.response?.data;
    const status = error.response?.status || 500;
    return NextResponse.json(
      {
        message:
          backendData?.message ||
          backendData?.errors?.[0] ||
          "Sunucu hatası oluştu.",
        statusCode: status,
      },
      { status },
    );
  }
}
