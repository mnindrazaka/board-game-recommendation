import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { relations } from "./relation";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  relations: relations,
});
