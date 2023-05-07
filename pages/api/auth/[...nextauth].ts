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
          const { access_token: authorisationToken } = tokens;
          //console.log("authorisationToken", authorisationToken)

          const res = await fetch("https://todoist.com/sync/v9/sync", {
            headers: {
              "Authorization": `Bearer ${authorisationToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "sync_token": "*",
              "resource_types": ["user"],
            })
          })

          const { user } = await res.json()
          // console.log("user", user)

          const profile = {
            "authorisationToken": authorisationToken,
            "user": user
          }
          // console.log("profile", profile)

          return profile
        },
      },
      profile(profile) {
        const { user, authorisationToken } = profile;
        console.log("token (PROFILE)", authorisationToken)
        console.log("token  (USER.TOKEN)", user.token)

        const profile2 = {
          id: user.id,
          name: user.full_name,
          email: user.email,
          image: user.avatar_big,
          token: user.token,
          inbox_project_id: user.inbox_project_id,
          is_premium: user.is_premium,
          joined_at: user.joined_at,
          lang: user.lang,
          premium_status: user.premium_status,
          start_day: user.start_day,
          start_page: user.start_page,
          team_inbox_id: user.team_inbox_id,
          verification_status: user.verification_status,
        }

        return profile
      }
    }),
  ],
};

//export default NextAuth(authOptions)
export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
