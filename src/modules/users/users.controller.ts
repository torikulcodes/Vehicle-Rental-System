import { Request, Response } from "express";
import { userService } from "./users.service";
import { IRequestUser } from "../../interface/requestUser";

const getAllusers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message:
        result.rows.length > 0
          ? "Users retrieved successfully"
          : "No users found",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const payload = req.body;
    const user = req.user;
    const result = await userService.updateUser(
      Number(userId),
      user as IRequestUser,
      payload,
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const userController = {
  getAllusers,
  updateUser,
};
