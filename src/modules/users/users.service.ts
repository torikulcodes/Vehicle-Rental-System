import { pool } from "../../config/database";
import { IRequestUser } from "../../interface/requestUser";
import { Role } from "../../middlewares/checkAuth";
import { IUpdateUser } from "./user.interface";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id,name, email,phone, role FROM users`,
  );

  return result;
};

const updateUser = async (
  id: number,
  user: IRequestUser,
  payload: IUpdateUser,
) => {
  const existUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  if (existUser.rows.length === 0) throw new Error("User not found");

  if (user.role === Role.CUSTOMER) {
    if (existUser.rows[0].id !== user.id)
      throw new Error("You can't update another user");
  }

  return await pool.query(
    `UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *`,
    [payload.name, payload.email, payload.phone, payload.role, id],
  );
};

const deleteUser = async (id: number, user: IRequestUser) => {
  const existBooking = await pool.query(
    `SELECT * FROM bookings WHERE user_id = $1 AND status = 'active'`,
    [id],
  );

  if (id === user.id) throw new Error("You can't delete yourself");

  if (existBooking.rows.length > 0) throw new Error("User has active booking");

  return await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
