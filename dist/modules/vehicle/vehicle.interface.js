"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleStatus = exports.VehicleType = void 0;
var VehicleType;
(function (VehicleType) {
    VehicleType["CAR"] = "car";
    VehicleType["BIKE"] = "bike";
    VehicleType["VAN"] = "van";
    VehicleType["SUV"] = "SUV";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["AVAILABLE"] = "available";
    VehicleStatus["BOOKED"] = "booked";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
