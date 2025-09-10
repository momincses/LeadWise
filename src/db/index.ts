import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'; // ✅ Import everything from your schema file

// Create a client instance for your database using the postgres package
const client = postgres(process.env.DATABASE_URL!);

// ✅ Pass the imported schema to the drizzle function
// This is what enables `db.query` and solves your error.
export const db = drizzle(client, { schema });

