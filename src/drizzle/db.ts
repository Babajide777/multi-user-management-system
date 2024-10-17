import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import "reflect-metadata";
import { DATABASE_URL } from "./env";
import { schema } from "./schema";

// create the connection
const poolConnection = mysql.createPool(DATABASE_URL as string);

export const db = drizzle(poolConnection, { schema, mode: "default" });
