import { Request, Response } from "express";

import { IRequestUser } from "../../interface/requestUser";
import { bookingService } from "./bookings.service";

const createBookingController = async (req: Request, res: Response) => {
  try {
    const user = req.user; 
    const payload = req.body;

    const booking = await bookingService.createBooking(
      user as IRequestUser,
      payload,
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await bookingService.getAllBookings(user as IRequestUser);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const user = req.user;
    const payload = req.body;

    const result = await bookingService.updateBooking(bookingId, user as IRequestUser, payload);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = { createBookingController, getAllBookings, updateBooking };
