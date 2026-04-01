import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const result = await vehicleService.createVehicles(payload);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    res.status(200).json({
      success: true,
      message:
        result.rows.length > 0
          ? "Vehicles retrieved successfully"
          : "No vehicles found",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const result = await vehicleService.getVehicleById(Number(vehicleId));
    res.status(200).json({
      success: true,
      message:
        result.rows.length > 0
          ? "Vehicle retrieved successfully"
          : "No vehicle found",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const payload = req.body;

    const result = await vehicleService.updateVehicle(
      Number(vehicleId),
      payload,
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const result = await vehicleService.deleteVehicle(Number(vehicleId));

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const vehicleController = {
  createVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
