import bcrypt from "bcryptjs";
import { pool } from "../../config/database";
import jwt from "jsonwebtoken";
import config from "../../config";

// create user
const createUsers = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
) => {
  // Validation (throw error)
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (role !== "admin" && role !== "customer") {
    throw new Error("Role can only be 'customer' or 'admin'");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, hashedPassword, phone, role || "customer"],
  );

  // MUST return result
  return result;
};

const loginUser = async (email: string, password: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(password, user.rows[0].password);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  const tokenPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const token = jwt.sign(tokenPayload, config.jwt_secret as string, {
    expiresIn: "7d",
  });

  return { token: token, user: user.rows[0] };
};



export const userService = {
  createUsers,
  loginUser,
 
};
