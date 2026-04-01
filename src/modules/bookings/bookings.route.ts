import { Router } from "express";
import { bookingController } from "./bookings.controller";
import { checkAuth, Role } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/",
  checkAuth(Role.CUSTOMER, Role.ADMIN),
  bookingController.createBookingController,
);

router.get("/", checkAuth(Role.ADMIN, Role.CUSTOMER), bookingController.getAllBookings);

router.put("/:bookingId", checkAuth(Role.ADMIN, Role.CUSTOMER), bookingController.updateBooking);

export const bookingRoute = router;