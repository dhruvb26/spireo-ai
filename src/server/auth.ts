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
import { JWT } from "next-auth/jwt";
import { type User } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      hasAccess?: boolean;
      trialEndsAt?: Date;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
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
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: "RefreshAccessTokenError";
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: token.refreshToken!, // Using refreshToken as the authorization code
        client_id: env.LINKEDIN_CLIENT_ID,
        client_secret: env.LINKEDIN_CLIENT_SECRET,
        // redirect_uri: `${env.NEXTAUTH_URL}/api/auth/callback/linkedin`,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  debug: false,
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    jwt: async ({ token, account, user }) => {
      if (account && user) {
        // Initial sign in
        token.id = user.id;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.hasAccess = (user as User).hasAccess;
        token.trialEndsAt = (user as User).trialEndsAt;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt ?? 0) * 1000) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        hasAccess: token.hasAccess,
        trialEndsAt: token.trialEndsAt,
      },
      error: token.error,
    }),
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
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
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
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);