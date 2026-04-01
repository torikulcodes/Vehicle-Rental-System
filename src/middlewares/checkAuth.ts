import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export const checkAuth =
  (...allowedRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
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
      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      // 4. Role check
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed",
        });
      }

      
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }
  };
