import NextAuth from "next-auth";
import { authOptions } from "@/providers/AuthProvider";

/**
 * NextAuth API Route Handler.
 * Tüm auth işlemleri (login, logout, session, callback) bu route üzerinden yönetilir.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
