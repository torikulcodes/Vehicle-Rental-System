import { Pool } from "pg";
import config from "./index";

export const pool = new Pool({
  connectionString: config.connection_str,
});

const initDB = async () => {
  // USERS TABLE
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'customer'
      CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // VEHICLES TABLE
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(150) NOT NULL,
      type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
      registration_number VARCHAR(100) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // BOOKINGS TABLE
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      vehicle_id INTEGER NOT NULL,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      -- FOREIGN KEYS
      CONSTRAINT fk_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_vehicle
        FOREIGN KEY(vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE CASCADE,

      -- VALIDATION
      CONSTRAINT check_dates
        CHECK (rent_end_date > rent_start_date)
    );
  `);
};

export default initDB;
