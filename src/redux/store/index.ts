import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "@/redux/slices/basketSlice";
import uiReducer from "@/redux/slices/uiSlice";

/**
 * Redux Store — yalnızca UI state için kullanılır.
 * Sunucu verisi TanStack Query ile yönetilir.
 */
export const store = configureStore({
  reducer: {
    basket: basketReducer,
    ui: uiReducer,
  },
});

// TypeScript typed hook'lar için
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
