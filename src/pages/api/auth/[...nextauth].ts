/* eslint-disable @typescript-eslint/consistent-type-definitions */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { SignInDocument, RefreshTokenDocument } from "~/generated/generated";
import { client } from "~/lib/apollo";
import { isJwtExpired, getRefreshTokenExpiry } from "~/utils/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
  }

  interface User {
    login: {
      data: {
        accessToken: string;
        refreshToken: string;
      };
    };

    accessToken: string;
  }

  interface AdapterUser {
    data: {
      access: string;
      refresh: string;
    };
    accessToken: string;
  }

  interface JWT {
    iat: number;
    exp: number;
    accessToken: string;
  }

  interface Session {
    accessToken: string;
  }
}

export const refreshToken = async function (token: string) {
  console.log("refreshing token", token);
  const { data } = await client.mutate({
    mutation: RefreshTokenDocument,
    variables: {
      refreshToken: token,
    },
  });
  console.log("refreshToken", data);
  if (data?.refreshToken.__typename === "MutationRefreshTokenSuccess") {
    return [
      data.refreshToken.data.accessToken,
      data.refreshToken.data.refreshToken,
    ];
  }
  console.log("refreshToken failed");
  return [null, null];
};

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  debug: env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const { data } = await client.mutate({
          mutation: SignInDocument,
          variables: {
            email: credentials.email,
            password: credentials.password,
          },
        });
        if (data?.login.__typename === "MutationLoginSuccess")
          return {
            id: "",
            login: data.login,
            accessToken: "",
          };
        else return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    redirect({ baseUrl }) {
      return baseUrl;
    },
    jwt: async ({ token, user }) => {
      if (!token && !user) return token;

      if (user) {
        const { accessToken, refreshToken } = user.login.data;
        token = {
          ...token,
          accessToken: accessToken,
          refreshToken: refreshToken,
          iat: Math.floor(Date.now() / 1000),
          exp: getRefreshTokenExpiry(refreshToken),
        };
        return token;
      }

      // user was signed in previously, we want to check if the token needs refreshing
      // token has been invalidated, try refreshing it

      if (isJwtExpired(String(token.accessToken))) {
        console.log("expired, refreshing token");
        const [newAccessToken, newRefreshToken] = await refreshToken(
          String(token.refreshToken),
        );
        console.log(
          "newAccessToken",
          newAccessToken,
          "newRefreshToken",
          newRefreshToken,
        );
        console.log("old token", token);

        if (newAccessToken && newRefreshToken) {
          token = {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            exp: getRefreshTokenExpiry(newRefreshToken),
          };
          console.log("token-new-token-attached", token);

          return token;
        }

        // unable to refresh tokens from backend, invalidate the token
        console.log(
          "unable to refresh tokens from backend, invalidate the token",
        );
        return token;
      }
      // token.data = await fetchUser(token.accessToken as string);
      console.log("token-data-attached", token);
      return token;
    },
    session({ session, token, user }) {
      const userOrToken = user || token;
      session.accessToken = userOrToken.accessToken;
      return session;
    },
  },
});
