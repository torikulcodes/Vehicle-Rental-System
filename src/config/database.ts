import { Pool } from "pg";
import config from "./index";

export const pool = new Pool({
  connectionString: config.connection_str,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(11) NOT NULL,
      role VARCHAR(20) DEFAULT 'customer'
    )
  `);
};

export default initDB