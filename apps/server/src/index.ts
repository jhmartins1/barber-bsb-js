import { auth } from "@barberjs/auth";
import { env } from "@barberjs/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { CreateBarberController, createBarberBodySchema } from "./controllers/Barber/CreateBarberController";
import { GetOneBarberController } from "./controllers/Barber/GetOneBarberController";
import { GetAllBarberController } from "./controllers/Barber/GetAllBarberController";
import { UpdateBarberController } from "./controllers/Barber/UpdateBarberController";
import { DeleteBarberController } from "./controllers/Barber/DeleteBarberController";

import { CreateBServiceController, createServiceBodySchema } from "./controllers/BServices/CreateBServiceController";
import { GetAllBServiceController } from "./controllers/BServices/GetAllBServiceController";
import { GetOneBServiceController } from "./controllers/BServices/GetOneBServiceController";
import { UpdateBServiceController } from "./controllers/BServices/UpdateBServiceController";
import { DeleteBServiceController } from "./controllers/BServices/DeleteBServiceController";

import { CreateScheduleController, createScheduleBodySchema } from "./controllers/Schedule/CreateScheduleController";
import { GetAllScheduleController } from "./controllers/Schedule/GetAllScheduleController";


const createBarberController = new CreateBarberController();
const getOneBarberController = new GetOneBarberController();
const getAllBarberController = new GetAllBarberController();
const updateBarberController = new UpdateBarberController();
const deleteBarberController = new DeleteBarberController();

const createBServiceController = new CreateBServiceController();
const getAllBServiceController = new GetAllBServiceController();
const getOneBServiceController = new GetOneBServiceController();
const updateBServiceController = new UpdateBServiceController();
const deleteBServiceController = new DeleteBServiceController();

const createScheduleController = new CreateScheduleController();
const getAllScheduleController = new GetAllScheduleController();

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
  .post("/service", (ctx) => createBServiceController.handle(ctx), {
    body: createServiceBodySchema,
  })
  .get("/service", () => getAllBServiceController.handle())
  .get("/service/:id", (ctx) => getOneBServiceController.handle(ctx))
  .put("/service/:id", (ctx) => updateBServiceController.handle(ctx))
  .delete("/service/:id", (ctx) => deleteBServiceController.handle(ctx))
  .post("/schedule", (ctx) => createScheduleController.handle(ctx), {
    body: createScheduleBodySchema,
  })
  .get("/schedule", (ctx) => getAllScheduleController.handle(ctx))
  .get("/", () => "Hello, World!")
  .listen(3333, () => {
    console.log("Server is running on http://localhost:3333");
  });
