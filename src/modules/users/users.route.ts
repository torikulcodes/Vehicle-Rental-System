import { Router } from "express";
import { userController } from "./users.controller";
import { checkAuth, Role } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), userController.getAllusers);

router.put("/:userId", checkAuth(Role.ADMIN), userController.updateUser);

export const userRoute = router;
