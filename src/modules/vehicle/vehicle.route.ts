import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { checkAuth, Role } from "../../middlewares/checkAuth";


const router = Router();

router.post("/",checkAuth(Role.ADMIN),vehicleController.createVehicles);

router.get("/",vehicleController.getAllVehicles);

router.get("/:vehicleId",vehicleController.getVehicleById);

router.put("/:vehicleId",checkAuth(Role.ADMIN),vehicleController.updateVehicle);

router.delete("/:vehicleId",checkAuth(Role.ADMIN),vehicleController.deleteVehicle);
export const vehicleRoute = router;