import express from "express";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import initDB from "./config/database";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { userRoute } from "./modules/users/users.route";
import { bookingRoute } from "./modules/bookings/bookings.route";

const app = express();

app.use(express.json());
initDB();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/bookings", bookingRoute);
app.listen(config.port, () => {
  console.log("server is running");
});
