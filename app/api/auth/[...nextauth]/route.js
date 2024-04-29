import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: "12423760",
  providers: [
    GoogleProvider({
      clientId:
        "813275162958-ut4sras4tic6b9clb8ij89fn86dau3m1.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
};
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
