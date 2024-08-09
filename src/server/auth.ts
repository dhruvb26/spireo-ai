import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import LinkedInProvider from "next-auth/providers/linkedin";
import { env } from "@/env";
import { db } from "@/server/db";
import { accounts, users } from "@/server/db/schema";
import { v4 as uuidv4 } from "uuid";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      hasAccess?: boolean;
      trialEndsAt?: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    hasAccess?: boolean;
    trialEndsAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    hasAccess?: boolean;
    trialEndsAt?: Date;
  }
}

export const authOptions: NextAuthOptions = {
  debug: false,
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      // If the user is already logged in and tries to access the signin page,
      // redirect them to the home page or dashboard
      if (url.startsWith(baseUrl + "/signin")) {
        const session = await getServerSession(authOptions);
        if (session) {
          return baseUrl + "/dashboard/post"; // or wherever you want to redirect logged-in users
        }
      }
      return url;
    },
  },
  adapter: {
    ...DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
    }),
    createUser: async (userData) => {
      const id = uuidv4();
      const now = new Date();
      const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      const result = await db
        .insert(users)
        .values({
          id,
          name: userData.name,
          email: userData.email,
          trialEndsAt: trialEndsAt,
          emailVerified: userData.emailVerified,
          image: userData.image,
          hasAccess: true,
        })
        .returning();
      return result[0];
    },
  } as Adapter,
  providers: [
    LinkedInProvider({
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      issuer: "https://www.linkedin.com",
      client: { token_endpoint_auth_method: "client_secret_post" },
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      authorization: {
        params: {
          scope: "openid profile email w_member_social r_basicprofile",
        },
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
