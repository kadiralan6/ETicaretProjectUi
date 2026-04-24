"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/providers/QueryProvider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { Toaster } from "react-hot-toast";

/**
 * Provider hiyerarşisi:
 * SessionProvider → QueryProvider → ReduxProvider → ChakraProvider → ThemeProvider
 * TranslationProvider → app/[lang]/layout.tsx tarafından yönetilir (lang param'a göre)
 * Admin için → app/admin/(protected)/layout.tsx içinde hardcoded "tr"
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ReduxProvider>
          <ChakraProvider value={defaultSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              {children}
              <Toaster position="top-right" />
            </ThemeProvider>
          </ChakraProvider>
        </ReduxProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
