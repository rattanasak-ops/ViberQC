// ============================================================
// ViberQC — Database Connection (Drizzle + PostgreSQL)
// ============================================================

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Only connect if DATABASE_URL is provided
const client = connectionString ? postgres(connectionString) : null;
export const db = client ? drizzle(client, { schema }) : (null as unknown as ReturnType<typeof drizzle<typeof schema>>);
