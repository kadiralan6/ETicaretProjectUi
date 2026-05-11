import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * NextAuth v4 yapılandırması.
 *
 * CredentialsProvider ile email/şifre girişi yapılır.
 * Backend Identity Service response formatı:
 *   { isSuccess, statusCode, data: { accessToken, refreshToken, expiration, userId, email, firstName, lastName, roles } }
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
          const response = await axios.post(
            `${BACKEND_URL}/api/identity/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
          );

          // Backend: { isSuccess, statusCode, data: { accessToken, refreshToken, userId, ... } }
          const body = response.data;

          if (body?.isSuccess && body?.data?.accessToken) {
            const tokenData = body.data;
            return {
              id: String(tokenData.userId),
              email: tokenData.email,
              name: `${tokenData.firstName || ""} ${tokenData.lastName || ""}`.trim(),
              accessToken: tokenData.accessToken,
              refreshToken: tokenData.refreshToken,
              expiration: tokenData.expiration,
              role: tokenData.roles?.[0] ?? "User",
            };
          }

          throw new Error(body?.message || "Geçersiz e-posta veya şifre");
        } catch (error: any) {
          const backendMsg =
            error?.response?.data?.message ||
            error?.response?.data?.errors?.[0];
          throw new Error(backendMsg || "Geçersiz e-posta veya şifre");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // İlk login'de user nesnesi gelir — JWT token'a kaydet
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.expiration = (user as any).expiration;
        token.role = (user as any).role;
        token.userId = (user as any).id;
      }
      return token;
    },

    async session({ session, token }) {
      // Session'a token bilgilerini inject et
      return {
        ...session,
        accessToken: {
          token: token.accessToken as string,
          expiration: token.expiration as string,
        },
        user: {
          ...session.user,
          id: token.userId as string,
          role: token.role as string,
        },
      };
    },
  },

  pages: {
    signIn: "/tr/login",
    error: "/tr/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 saat
  },

  secret:
    process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
};
