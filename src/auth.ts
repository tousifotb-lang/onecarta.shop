import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        userObject: { label: "User Object", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.userObject) return null;
        try {
          return JSON.parse(credentials.userObject as string);
        } catch {
          return null;
        }
      },
    }),
  ],
});