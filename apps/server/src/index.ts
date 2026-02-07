import { auth } from "@barberjs/auth";
import { env } from "@barberjs/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { CreateBarberController, createBarberBodySchema } from "./controllers/Barber/CreateBarberController";

const createBarberController = new CreateBarberController();

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
  .post("/barber", (ctx) => createBarberController.handle(ctx), {
    body: createBarberBodySchema,
  })
  .get("/", () => "Hello, World!")
  .listen(3333, () => {
    console.log("Server is running on http://localhost:3333");
  });
