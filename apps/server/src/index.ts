import { auth } from "@barberjs/auth";
import { env } from "@barberjs/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .all("/api/auth/*", async (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      return auth.handler(request);
    }
    return status(405);
  })
  .get("/", () => "Hello, World!")
  .listen(3333, () => {
    console.log("Server is running on http://localhost:3333");
  });
