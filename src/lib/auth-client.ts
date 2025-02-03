import { createAuthClient } from "better-auth/react";
import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  query: {
    disableCookieCache: true,
  },
  plugins: [emailOTPClient(), magicLinkClient()],
  baseURL: process.env.BETTER_AUTH_URL as string,
});
