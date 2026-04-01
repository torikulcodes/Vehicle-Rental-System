import { pool } from "../../config/database";
import { IRequestUser } from "../../interface/requestUser";
import { Role } from "../../middlewares/checkAuth";


interface ICreateBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

 const createBooking = async (
  user: IRequestUser,
  payload: ICreateBooking
) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;


  if (user.role === "customer" && user.id !== customer_id) {
    throw new Error("You are not allowed to create booking for another user");
  }


  const vehicleRes = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [vehicle_id]
  );

  if (vehicleRes.rows.length === 0) throw new Error("Vehicle not found");

  const vehicle = vehicleRes.rows[0];
  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  if (end <= start) throw new Error("Rent end date must be after start date");

  const days =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  const total_price = days * vehicle.daily_rent_price;

  const bookingRes = await pool.query(
    `INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active') 
      RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = bookingRes.rows[0];

  await pool.query(
    "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
    [vehicle_id]
  );

  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

export const getAllBookings = async (user: IRequestUser) => {
  if (user.role === Role.ADMIN) {
    const res = await pool.query(
      `SELECT b.*, 
              u.name AS customer_name, u.email AS customer_email,
              v.vehicle_name, v.registration_number
       FROM bookings b
       JOIN users u ON b.customer_id = u.id
       JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.id ASC`
    );

    const data = res.rows.map(row => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number
      }
    }));

    return { message: "Bookings retrieved successfully", data };
  }

  
  const res = await pool.query(
    `SELECT b.*, v.vehicle_name, v.registration_number, v.type
       FROM bookings b
       JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.customer_id = $1
       ORDER BY b.id ASC`,
    [user.id]
  );

  const data = res.rows.map(row => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type
    }
  }));

  return data
};

export const updateBooking = async (
  bookingId: number,
  user: IRequestUser,
  payload: { status: "cancelled" | "returned" }
) => {
  const { status } = payload;

  const bookingRes = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("You are not allowed to update this booking");
    }

    if (status !== "cancelled") {
      throw new Error("Customer can only cancel booking");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("Cannot cancel booking after start date");
    }

    const updated = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking cancelled successfully",
      data: updated.rows[0],
    };
  }

  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark booking as returned");
    }

    const updated = await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...updated.rows[0],
        vehicle: {
          availability_status: "available",
        },
      },
    };
  }

  throw new Error("Invalid role");
};

export const bookingService = { createBooking, getAllBookings, updateBooking };