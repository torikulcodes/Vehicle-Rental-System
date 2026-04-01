"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const auth_route_1 = require("./modules/auth/auth.route");
const database_1 = __importDefault(require("./config/database"));
const vehicle_route_1 = require("./modules/vehicle/vehicle.route");
const users_route_1 = require("./modules/users/users.route");
const bookings_route_1 = require("./modules/bookings/bookings.route");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, database_1.default)();
app.use("/api/v1/auth", auth_route_1.authRoute);
app.use("/api/v1/vehicles", vehicle_route_1.vehicleRoute);
app.use("/api/v1/users", users_route_1.userRoute);
app.use("/api/v1/bookings", bookings_route_1.bookingRoute);
app.listen(config_1.default.port, () => {
    console.log("server is running");
});
