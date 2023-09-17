import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionUserProfile, SignInCredentials } from "./app/types";

// next-auth 에 이미 지정된 Session interface 를 오버라이딩한다.
declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, request) {
        const { email, password } = credentials as SignInCredentials;
        const { user, error } = await fetch(
          "http://localhost:3000/api/users/signin",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        ).then(async (res) => await res.json());

        if (error) return null;
        console.log("user: ", user);
        return { id: user.id, ...user };
      },
    }),
  ],
  callbacks: {
    // jwt 에 있는 정보를 session 의 token 정보로 옮긴다.
    async jwt(params) {
      if (params.user) {
        // params.user 에 user에 대한 모든 정보가 았기때문에 token 아래 user를 만들어 저장
        params.token = { ...params.token, ...params.user };
      }
      return params.token;
    },
    async session(params) {
      const user = params.token as typeof params.token & SessionUserProfile;

      if (user) {
        params.session.user = {
          ...params.session.user,
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          verified: user.verified,
        };
      }
      return params.session;
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
