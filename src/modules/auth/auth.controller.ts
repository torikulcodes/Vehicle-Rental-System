import { Request, Response } from "express";
import { pool } from "../../config/database";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (role !== "admin" && role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Role can only be 'customer' or 'admin'",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users(name, email, password, phone, role)
   VALUES($1, $2, $3, $4, $5)
   RETURNING *`,
      [name, email, hashedPassword, phone, role || "customer"]
    );

    const user = result.rows[0];
    delete user.password;

    return res.status(201).json({
      success: true,
      message: "You successfully registered",
      user,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  res.send("Login working");
};
