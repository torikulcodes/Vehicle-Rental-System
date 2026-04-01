"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../../config/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
// create user
const createUsers = async (name, email, password, phone, role) => {
    // Validation (throw error)
    if (!email || typeof email !== "string" || !email.includes("@")) {
        throw new Error("Valid email is required");
    }
    if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }
    if (role !== "admin" && role !== "customer") {
        throw new Error("Role can only be 'customer' or 'admin'");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const result = await database_1.pool.query(`INSERT INTO users(name, email, password, phone, role)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`, [name, lowerCaseEmail, hashedPassword, phone, role || "customer"]);
    // MUST return result
    return result;
};
const loginUser = async (email, password) => {
    const lowerCaseEmail = email.toLowerCase();
    const user = await database_1.pool.query(`SELECT * FROM users WHERE email = $1`, [
        lowerCaseEmail,
    ]);
    if (user.rows.length === 0) {
        throw new Error("User not found");
    }
    const isValid = await bcryptjs_1.default.compare(password, user.rows[0].password);
    if (!isValid) {
        throw new Error("Invalid password");
    }
    const tokenPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, config_1.default.jwt_secret, {
        expiresIn: "7d",
    });
    return { token: token, user: user.rows[0] };
};
exports.userService = {
    createUsers,
    loginUser,
};
