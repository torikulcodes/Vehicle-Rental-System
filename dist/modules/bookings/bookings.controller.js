"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = exports.updateBooking = void 0;
const bookings_service_1 = require("./bookings.service");
const createBookingController = async (req, res) => {
    try {
        const user = req.user;
        const payload = req.body;
        const booking = await bookings_service_1.bookingService.createBooking(user, payload);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
const getAllBookings = async (req, res) => {
    try {
        const user = req.user;
        const result = await bookings_service_1.bookingService.getAllBookings(user);
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
const updateBooking = async (req, res) => {
    try {
        const bookingId = Number(req.params.bookingId);
        const user = req.user;
        const payload = req.body;
        const result = await bookings_service_1.bookingService.updateBooking(bookingId, user, payload);
        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateBooking = updateBooking;
exports.bookingController = { createBookingController, getAllBookings, updateBooking: exports.updateBooking };
