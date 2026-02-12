import { auth } from "@barberjs/auth";
import { env } from "@barberjs/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

// BARBER IMPORTS
import { CreateBarberController, createBarberBodySchema } from "./controllers/Barber/CreateBarberController";
import { GetOneBarberController } from "./controllers/Barber/GetOneBarberController";
import { GetAllBarberController } from "./controllers/Barber/GetAllBarberController";
import { UpdateBarberController } from "./controllers/Barber/UpdateBarberController";
import { DeleteBarberController } from "./controllers/Barber/DeleteBarberController";

// BARBER SERVICES IMPORTS
import { CreateBServiceController, createServiceBodySchema } from "./controllers/BServices/CreateBServiceController";
import { GetAllBServiceController } from "./controllers/BServices/GetAllBServiceController";
import { GetOneBServiceController } from "./controllers/BServices/GetOneBServiceController";
import { UpdateBServiceController } from "./controllers/BServices/UpdateBServiceController";
import { DeleteBServiceController } from "./controllers/BServices/DeleteBServiceController";

// SCHEDULE IMPORTS
import { CreateScheduleController, createScheduleBodySchema } from "./controllers/Schedule/CreateScheduleController";
import { GetAllScheduleController } from "./controllers/Schedule/GetAllScheduleController";
import { GetOneScheduleController } from "./controllers/Schedule/GetOneScheduleController";
import { UpdateScheduleController } from "./controllers/Schedule/UpdateScheduleController";
import { DeleteScheduleController } from "./controllers/Schedule/DeleteScheduleController";


// BARBER CONTROLLERS
const createBarberController = new CreateBarberController();
const getOneBarberController = new GetOneBarberController();
const getAllBarberController = new GetAllBarberController();
const updateBarberController = new UpdateBarberController();
const deleteBarberController = new DeleteBarberController();

// BARBER SERVICES CONTROLLERS
const createBServiceController = new CreateBServiceController();
const getAllBServiceController = new GetAllBServiceController();
const getOneBServiceController = new GetOneBServiceController();
const updateBServiceController = new UpdateBServiceController();
const deleteBServiceController = new DeleteBServiceController();

// SCHEDULE CONTROLLERS
const createScheduleController = new CreateScheduleController();
const getAllScheduleController = new GetAllScheduleController();
const getOneScheduleController = new GetOneScheduleController();
const updateScheduleController = new UpdateScheduleController();
const deleteScheduleController = new DeleteScheduleController();

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", 'Cookie'],
      credentials: true,
      exposeHeaders: ["Set-Cookie"],
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
  .get("/schedule/:id", (ctx) => getOneScheduleController.handle(ctx))
  .put("/schedule/:id", (ctx) => updateScheduleController.handle(ctx))
  .delete("/schedule/:id", (ctx) => deleteScheduleController.handle(ctx))
  .get("/", () => "Hello, World!")
  .listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
