import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, magicLink } from "better-auth/plugins";
import OTPMailer from "../../emails/OTPMailer";
import MagicLinkMailer from "../../emails/MagicLinkMailer";

export const auth = betterAuth({
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        try {
          const name = email.split("@")[0];
          await OTPMailer({ name, email, OTP: otp });

          console.log(`✅ OTP sent to ${email} for ${type}: ${otp}`);
        } catch (error) {
          console.error("❌ Failed to send OTP:", error);
        }
      },
    }),
    magicLink({
      async sendMagicLink({ email, token, url }) {
        try {
          const name = email.split("@")[0];

          const magicLink = `${url}`;

          await MagicLinkMailer({ name, email, magicLink });

          console.log(`✅ Magic link sent to ${email}`);
        } catch (error) {
          console.error("❌ Failed to send magic link:", error);
        }
      },
    }),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  database: prismaAdapter(prisma, { provider: "postgresql" }),
});
