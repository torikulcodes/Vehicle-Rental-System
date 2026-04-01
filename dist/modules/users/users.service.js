"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const database_1 = require("../../config/database");
const checkAuth_1 = require("../../middlewares/checkAuth");
const getAllUsers = async () => {
    const result = await database_1.pool.query(`SELECT id,name, email,phone, role FROM users`);
    return result;
};
const updateUser = async (id, user, payload) => {
    const existUser = await database_1.pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (existUser.rows.length === 0)
        throw new Error("User not found");
    if (user.role === checkAuth_1.Role.CUSTOMER) {
        if (existUser.rows[0].id !== user.id)
            throw new Error("You can't update another user");
    }
    return await database_1.pool.query(`UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`, [payload.name, payload.email, payload.phone, payload.role, id]);
};
const deleteUser = async (id, user) => {
    const existBooking = await database_1.pool.query(`SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`, [id]);
    if (id === user.id)
        throw new Error("You can't delete yourself");
    if (existBooking.rows.length > 0)
        throw new Error("User has active booking");
    return await database_1.pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};
exports.userService = {
    getAllUsers,
    updateUser,
    deleteUser,
};
