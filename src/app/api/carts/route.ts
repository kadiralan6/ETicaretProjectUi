import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import httpClient from "@/util/httpClient";
import { authOptions } from "@/providers/AuthProvider";
import { CART_GET_BY_USER_ID } from "@/constants/apiEndpoints";

// GET /api/carts → GET /api/basket/CartItems/getByUserId/{userId}
export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await httpClient.get(`${CART_GET_BY_USER_ID}/${userId}`);
    // Response: { isSuccess, data: CartItem[] }
    const rawItems: any[] = response.data?.data ?? [];

    const items = rawItems.map((item: any) => ({
      id: item.cartItemId,
      cartId: 0,
      productId: item.productId,
      productName: item.productName,
      productSlug: item.productSlug,
      imageUrl:
        item.images?.find((img: any) => img.isCover)?.url ??
        item.images?.[0]?.url ??
        "",
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    }));

    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);

    return NextResponse.json({
      id: 0,
      userId: rawItems[0]?.userId ?? Number(userId),
      couponId: rawItems[0]?.couponId ?? null,
      couponCode: null,
      subtotal,
      discountAmount: 0,
      total: subtotal,
      items,
    });
  } catch (error: any) {
    const backendData = error.response?.data;
    const status = error.response?.status || 500;
    return NextResponse.json(
      { message: backendData?.message || "Sepet yüklenemedi." },
      { status },
    );
  }
}
