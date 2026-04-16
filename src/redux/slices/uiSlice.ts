import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isMobileMenuOpen: boolean;
  isLoadingOverlay: boolean;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  isLoadingOverlay: false,
};

/**
 * UI slice — genel UI state yönetimi.
 */
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMobileMenuOpen = action.payload;
    },
    setLoadingOverlay(state, action: PayloadAction<boolean>) {
      state.isLoadingOverlay = action.payload;
    },
  },
});

export const { toggleMobileMenu, setMobileMenuOpen, setLoadingOverlay } = uiSlice.actions;
export default uiSlice.reducer;
