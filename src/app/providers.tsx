"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { QueryProvider } from "@/providers/QueryProvider"
import { ReduxProvider } from "@/providers/ReduxProvider"

/**
 * Provider hiyerarşisi:
 * SessionProvider (NextAuth) → QueryProvider → ReduxProvider → ChakraProvider → ThemeProvider
 *
 * Sıralama önemlidir:
 * - SessionProvider en dışta: session hook'ları her yerde kullanılabilir
 * - QueryProvider: TanStack Query ile server state yönetimi
 * - ReduxProvider: Redux ile UI state yönetimi
 * - ChakraProvider + ThemeProvider: UI framework
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ReduxProvider>
          <ChakraProvider value={defaultSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </ChakraProvider>
        </ReduxProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
