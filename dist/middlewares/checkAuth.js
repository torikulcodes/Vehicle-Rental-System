"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.Role = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["CUSTOMER"] = "customer";
})(Role || (exports.Role = Role = {}));
const checkAuth = (...allowedRoles) => async (req, res, next) => {
    try {
        // 1. Authorization header check
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }
        // 2. Token extract
        const token = authHeader.split(" ")[1];
        // 3. Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        // 4. Role check
        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not allowed",
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token",
        });
    }
};
exports.checkAuth = checkAuth;
