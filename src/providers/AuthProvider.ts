import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * NextAuth v4 yapılandırması.
 *
 * CredentialsProvider ile email/şifre girişi yapılır.
 * Backend'den dönen access token JWT session'da saklanır.
 * httpClient bu token'ı her backend çağrısında Authorization header'ına ekler.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gereklidir");
        }

        try {
          // Backend login endpoint'ine istek at
          const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const data = response.data;

          if (data && data.token) {
            // NextAuth'un beklediği user nesnesi
            return {
              id: data.user?.id || "1",
              email: data.user?.email || credentials.email,
              name: `${data.user?.firstName || ""} ${data.user?.lastName || ""}`.trim(),
              accessToken: data.token,
              refreshToken: data.refreshToken,
            };
          }

          return null;
        } catch (error: any) {
          console.error("[Auth] Login error:", error.message);

          // Mock fallback — backend hazır olana kadar
          // TODO: Backend hazır olduğunda bu bloğu kaldır
          if (credentials.email === "admin@test.com" && credentials.password === "123456") {
            return {
              id: "mock-admin-1",
              email: "admin@test.com",
              name: "Admin User",
              accessToken: "mock-jwt-token-admin",
              refreshToken: "mock-refresh-token",
              role: "Admin",
            };
          }

          if (credentials.email === "user@test.com" && credentials.password === "123456") {
            return {
              id: "mock-user-1",
              email: "user@test.com",
              name: "Test User",
              accessToken: "mock-jwt-token-user",
              refreshToken: "mock-refresh-token",
              role: "Customer",
            };
          }

          throw new Error("Geçersiz e-posta veya şifre");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // İlk login'de user nesnesi gelir — token'a kaydet
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      // Session'a token bilgilerini inject et
      return {
        ...session,
        accessToken: {
          token: token.accessToken as string,
        },
        user: {
          ...session.user,
          role: token.role as string,
        },
      };
    },
  },

  pages: {
    signIn: "/login",        // Özel login sayfamız
    error: "/login",          // Hata durumunda login'e yönlendir
  },

  session: {
    strategy: "jwt",          // JWT tabanlı session
    maxAge: 24 * 60 * 60,     // 24 saat
  },

  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
};
