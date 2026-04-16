"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * TanStack Query Provider — istemci tarafı provider.
 * Server state cache ve senkronizasyonu yönetir.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,        // 1 dakika — veri taze sayılır
            gcTime: 5 * 60 * 1000,       // 5 dakika — garbage collection süresi
            refetchOnWindowFocus: false,  // Pencere odağında yeniden fetch etme
            retry: 1,                    // Hata durumunda 1 kez tekrar dene
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
