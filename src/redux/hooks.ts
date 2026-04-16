import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";

/**
 * Typed Redux hook'ları — RootState ve AppDispatch'e göre tiplenmiş.
 * Componentlerde direkt `useDispatch` / `useSelector` yerine bunları kullanın.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
