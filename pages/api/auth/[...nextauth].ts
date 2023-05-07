import NextAuth, { NextAuthOptions } from "next-auth"
import TodoistProvider from "next-auth/providers/todoist"
import checkEnv from "../utils/checkEnv"
import { NextApiRequest, NextApiResponse } from "next";
import { profile } from "console";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export const authOptions: NextAuthOptions = {
  providers: [
    TodoistProvider({
      clientId: checkEnv(process.env.TODOIST_ID),
      clientSecret: checkEnv(process.env.TODOIST_SECRET),
      authorization: {
        url: "https://todoist.com/oauth/authorize",
        params: {
          scope: "data:read,data:read_write,data:delete,project:delete"
        }
      },
      userinfo: {
        request: async ({ tokens }) => {
          const authToken = tokens.access_token;
          console.log("authToken", authToken)
          const rest = await fetch("https://todoist.com/sync/v9/sync", {
            headers: {
              "Authorization": `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "sync_token": "*",
              "resource_types": ["user"],
            })
          })
          const { user: profile } = await rest.json()
          return profile
        },
      },
      profile(profile) {
        console.log("profile", profile.token)
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.avatar_url,
          token: profile.token
        }
      }
    }),
  ],
};

//export default NextAuth(authOptions)
export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
