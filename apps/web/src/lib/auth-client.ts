import { env } from "@barberjs/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const loginSocial = async () => {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
};