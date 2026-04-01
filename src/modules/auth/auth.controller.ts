import { Request, Response } from "express";
import { userService } from "./auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    console.log(req.body);

    const result = await userService.createUsers(
      name,
      email,
      password,
      phone,
      role,
    );

    const user = result.rows[0];
    delete user.password;

    return res.status(201).json({
      success: true,
      message: "You successfully registered",
      user,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await userService.loginUser(email, password);

  return res.status(200).json(result);
};

export const authController = {
  register,
  login,
};
