import bcrypt from "bcryptjs"
import prisma from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET as string,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check that credentials exist and are strings
        if (
          !credentials?.email ||
          typeof credentials.email !== "string" ||
          !credentials?.password ||
          typeof credentials.password !== "string"
        ) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || typeof user.password !== "string") return null

        // Now TypeScript knows these are strings
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordsMatch) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      // Assert that user.id is a string
      token.id = user.id as string
    }
    return token
  },
  async session({ session, token }) {
    if (session.user) {
      // Assert that token.id is a string
      session.user.id = token.id as string
    }
    return session
  },
},

}







/* //auth.config.ts

import { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user) {
            return null
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!passwordsMatch) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session && session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
} satisfies NextAuthConfig
 */