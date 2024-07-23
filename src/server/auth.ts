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
  },
  adapter: {
    ...DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
    }),
    createUser: async (userData) => {
      const id = uuidv4();
      const now = new Date();
      const result = await db
        .insert(users)
        .values({
          id,
          name: userData.name,
          email: userData.email,
          emailVerified: userData.emailVerified,
          image: userData.image,
          hasAccess: false,
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
          scope: "openid profile email w_member_social",
        },
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
