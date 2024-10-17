import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/drizzle/index.ts",
  out: "./src/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  dialect: "mysql",
} satisfies Config;
