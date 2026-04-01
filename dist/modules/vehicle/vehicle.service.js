"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleService = void 0;
const database_1 = require("../../config/database");
const createVehicles = async (payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price } = payload;
    const existVehicle = await database_1.pool.query(`SELECT * FROM vehicles WHERE registration_number = $1`, [registration_number]);
    if (existVehicle.rows.length > 0)
        throw new Error("Vehicle already exist");
    return await database_1.pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price) VALUES($1, $2, $3, $4) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price]);
};
const getAllVehicles = async () => await database_1.pool.query(`SELECT * FROM vehicles`);
const getVehicleById = async (id) => await database_1.pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
const updateVehicle = async (id, payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const isExistVehicle = await database_1.pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    if (isExistVehicle.rows.length === 0)
        throw new Error("Vehicle not found");
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;
    if (vehicle_name) {
        updateFields.push(`vehicle_name = $${paramIndex++}`);
        updateValues.push(vehicle_name);
    }
    if (type) {
        updateFields.push(`type = $${paramIndex++}`);
        updateValues.push(type);
    }
    if (registration_number) {
        updateFields.push(`registration_number = $${paramIndex++}`);
        updateValues.push(registration_number);
    }
    if (daily_rent_price) {
        updateFields.push(`daily_rent_price = $${paramIndex++}`);
        updateValues.push(daily_rent_price);
    }
    if (availability_status) {
        updateFields.push(`availability_status = $${paramIndex++}`);
        updateValues.push(availability_status);
    }
    if (updateFields.length === 0)
        throw new Error("No fields provided to update");
    updateValues.push(id);
    return await database_1.pool.query(`UPDATE vehicles SET ${updateFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`, updateValues);
};
const deleteVehicle = async (id) => {
    const booking = await database_1.pool.query(`SELECT * FROM bookings 
   WHERE vehicle_id = $1 AND status = 'active'`, [id]);
    if (booking.rows.length > 0)
        throw new Error("Vehicle is currently booked");
    return await database_1.pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
};
exports.vehicleService = {
    createVehicles,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
