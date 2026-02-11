import dotenv from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// tenta carregar .env local se existir
dotenv.config({
  path: path.resolve(process.cwd(), "../../apps/server/.env"),
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
