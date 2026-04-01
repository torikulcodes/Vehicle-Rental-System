import { pool } from "../../config/database";
import { ICreateVehicle } from "./vehicle.interface";

const createVehicles = async (payload: ICreateVehicle) => {
  const { vehicle_name, type, registration_number, daily_rent_price } = payload;

  const existVehicle = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number = $1`,
    [registration_number],
  );

  if (existVehicle.rows.length > 0) throw new Error("Vehicle already exist");

  return await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price) VALUES($1, $2, $3, $4) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price],
  );
};

const getAllVehicles = async () => await pool.query(`SELECT * FROM vehicles`);

const getVehicleById = async (id: number) =>
  await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

const updateVehicle = async (id: number, payload: ICreateVehicle) => {
  const { vehicle_name, type, registration_number, daily_rent_price } = payload;

  const isExistVehicle = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [id],
  );

  if (isExistVehicle.rows.length === 0) throw new Error("Vehicle not found");

  return await pool.query(
    `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4 WHERE id = $5 RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, id],
  );
};

const deleteVehicle = async (id: number) => {
  const booking = await pool.query(
    `SELECT * FROM bookings 
   WHERE vehicle_id = $1 AND status = 'active'`,
    [id],
  );

  if (booking.rows.length > 0) throw new Error("Vehicle is currently booked");

  return await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
};

export const vehicleService = {
  createVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
