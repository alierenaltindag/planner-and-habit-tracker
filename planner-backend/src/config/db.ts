// import { SQL } from "bun"; 
// Note: Bun's SQL API is still experimental and might vary. 
// Using a safe approach assuming 'bun:sql' or similar if available.
// Documentation suggests: import { sql } from "bun";

import { sql } from "bun";

// Ensure DATABASE_URL is set in .env
const db = sql;

export default db;
