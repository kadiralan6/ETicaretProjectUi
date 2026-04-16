"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";

/**
 * Redux Provider — istemci tarafı provider.
 * Store'u tüm client component'lere sağlar.
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
