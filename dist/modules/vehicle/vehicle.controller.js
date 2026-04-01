"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleController = void 0;
const vehicle_service_1 = require("./vehicle.service");
const createVehicles = async (req, res) => {
    try {
        const payload = req.body;
        const result = await vehicle_service_1.vehicleService.createVehicles(payload);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const getAllVehicles = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleService.getAllVehicles();
        res.status(200).json({
            success: true,
            message: result.rows.length > 0
                ? "Vehicles retrieved successfully"
                : "No vehicles found",
            data: result.rows,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const getVehicleById = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicle_service_1.vehicleService.getVehicleById(Number(vehicleId));
        res.status(200).json({
            success: true,
            message: result.rows.length > 0
                ? "Vehicle retrieved successfully"
                : "No vehicle found",
            data: result.rows,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const payload = req.body;
        const result = await vehicle_service_1.vehicleService.updateVehicle(Number(vehicleId), payload);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const deleteVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicle_service_1.vehicleService.deleteVehicle(Number(vehicleId));
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
exports.vehicleController = {
    createVehicles,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
