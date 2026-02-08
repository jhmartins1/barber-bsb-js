import { auth } from "@barberjs/auth";
import { env } from "@barberjs/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { CreateBarberController, createBarberBodySchema } from "./controllers/Barber/CreateBarberController";
import { GetOneBarberController } from "./controllers/Barber/GetOneBarberController";
import { GetAllBarberController } from "./controllers/Barber/GetAllBarberController";
import { UpdateBarberController } from "./controllers/Barber/UpdateBarberController";
import { DeleteBarberController } from "./controllers/Barber/DeleteBarberController";

const createBarberController = new CreateBarberController();
const getOneBarberController = new GetOneBarberController();
const getAllBarberController = new GetAllBarberController();
const updateBarberController = new UpdateBarberController();
const deleteBarberController = new DeleteBarberController();

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
  .get("/barber/:id", (ctx) => getOneBarberController.handle(ctx))
  .get("/barber", () => getAllBarberController.handle())
  .put("/barber/:id", (ctx) => updateBarberController.handle(ctx))
  .delete("/barber/:id", (ctx) => deleteBarberController.handle(ctx))
  .get("/", () => "Hello, World!")
  .listen(3333, () => {
    console.log("Server is running on http://localhost:3333");
  });
