import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BasketItem } from "@/interfaces/basket";

interface BasketState {
  items: BasketItem[];
  totalPrice: number;
  itemCount: number;
  isDrawerOpen: boolean;
}

const initialState: BasketState = {
  items: [],
  totalPrice: 0,
  itemCount: 0,
  isDrawerOpen: false,
};

/**
 * Sepet slice — UI state olarak sepet verisi ve drawer durumu yönetir.
 * TanStack Query ile server'dan çekilen veri bu slice'a dispatch edilir.
 */
const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    /** TanStack Query'den gelen sepet verisini Redux'a yükle */
    setBasket(state, action: PayloadAction<{ items: BasketItem[]; totalPrice: number; itemCount: number }>) {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.itemCount = action.payload.itemCount;
    },

    /** Sepete yeni item ekle (iyimser güncelleme için) */
    addItem(state, action: PayloadAction<BasketItem>) {
      const existing = state.items.find((item) => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    /** Sepetten item sil */
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    /** Sepeti temizle */
    clearBasket(state) {
      state.items = [];
      state.totalPrice = 0;
      state.itemCount = 0;
    },

    /** Sepet drawer'ı aç/kapa */
    toggleDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isDrawerOpen = action.payload;
    },
  },
});

export const { setBasket, addItem, removeItem, clearBasket, toggleDrawer, setDrawerOpen } = basketSlice.actions;
export default basketSlice.reducer;
