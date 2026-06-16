import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // এটা খালি থাকবে, রাউটে আমরা প্রোভাইডার জুড়ব
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;