"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const users_service_1 = require("./users.service");
const getAllusers = async (req, res) => {
    try {
        const result = await users_service_1.userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: result.rows.length > 0
                ? "Users retrieved successfully"
                : "No users found",
            data: result.rows,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const payload = req.body;
        const user = req.user;
        const result = await users_service_1.userService.updateUser(Number(userId), user, payload);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = req.user;
        const result = await users_service_1.userService.deleteUser(Number(userId), user);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
exports.userController = {
    getAllusers,
    updateUser,
    deleteUser,
};
