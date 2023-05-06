import NextAuth, { NextAuthOptions } from "next-auth"
import TodoistProvider from "next-auth/providers/todoist"
import checkEnv from "../utils/checkEnv"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    TodoistProvider({
      clientId: checkEnv(process.env.TODOIST_ID),
      clientSecret: checkEnv(process.env.TODOIST_SECRET),
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
