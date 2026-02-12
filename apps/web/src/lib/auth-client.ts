import { env } from "@barberjs/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const loginSocial = () => {
  const callbackURL = encodeURIComponent(`${env.NEXT_PUBLIC_APP_URL}/dashboard`);
  window.location.href = `${env.NEXT_PUBLIC_SERVER_URL}/api/auth/sign-in/social?provider=google&callbackURL=${callbackURL}`;
};