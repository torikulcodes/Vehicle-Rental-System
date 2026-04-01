import { JwtPayload } from "jsonwebtoken";
import { Role } from "../middlewares/checkAuth";

declare global {
  namespace Express {
    interface Request {
      user?:JwtPayload
    }
  }
}
