"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        console.log(req.body);
        const result = await auth_service_1.userService.createUsers(name, email, password, phone, role);
        const user = result.rows[0];
        delete user.password;
        return res.status(201).json({
            success: true,
            message: "You successfully registered",
            user,
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Something went wrong",
        });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_service_1.userService.loginUser(email, password);
        return res.status(200).json({
            success: true,
            message: "You successfully logged in",
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
exports.authController = {
    register,
    login,
};
