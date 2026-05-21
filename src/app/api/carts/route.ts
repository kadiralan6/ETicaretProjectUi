import { NextResponse } from "next/server";
import httpClient from "@/util/httpClient";
import { CART_GET_BY_USER_ID } from "@/constants/apiEndpoints";

// GET /api/carts → GET /api/basket/CartItems/getByUserId
// Response: ApiResponse<GetBasketDto>
export async function GET() {
  try {
    const response = await httpClient.get(CART_GET_BY_USER_ID);
    const basket = response.data?.data;

    if (!basket) {
      return NextResponse.json({
        items: [],
        totalQuantity: 0,
        uniqueItemCount: 0,
        subTotal: 0,
        shippingCost: 0,
        appliedCoupon: null,
        appliedCampaign: null,
        totalDiscount: 0,
        total: 0,
      });
    }

    const items = (basket.items ?? []).map((item: any) => ({
      ...item,
      imageUrl:
        item.images?.find((img: any) => img.isMain)?.url ??
        item.images?.[0]?.url ??
        "",
    }));

    return NextResponse.json({
      items,
      totalQuantity: basket.totalQuantity ?? 0,
      uniqueItemCount: basket.uniqueItemCount ?? 0,
      subTotal: basket.subTotal ?? 0,
      shippingCost: basket.shippingCost ?? 0,
      appliedCoupon: basket.appliedCoupon ?? null,
      appliedCampaign: basket.appliedCampaign ?? null,
      totalDiscount: basket.totalDiscount ?? 0,
      total: basket.total ?? 0,
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
