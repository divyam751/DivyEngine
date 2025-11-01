import express from "express";
import {
  authentication,
  authorization,
} from "../middlewares/authMiddleware.js";
import {
  cancelBooking,
  createBooking,
  getAllBookingsInternal,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import internalAuthMiddleware from "../middlewares/internalAuthMiddleware.js";

const bookingRouter = express.Router();

/**
 * -------------------------------
 * 🧩 INTERNAL ROUTES (Microservice use only)
 * -------------------------------
 * These routes are not exposed to the frontend.
 * Other services (e.g., payment-service, car-service) call these using INTERNAL_SERVICE_TOKEN.
 */

// ✅ Get all bookings (internal microservice usage)
bookingRouter.get(
  "/internal/all",
  internalAuthMiddleware,
  getAllBookingsInternal
);

/**
 * -------------------------------
 * 🔒 PUBLIC ROUTES (Customer)
 * -------------------------------
 */

// ✅ Create a new booking (customer)
bookingRouter.post(
  "/",
  authentication,
  authorization("customer"),
  createBooking
);

// ✅ Get all bookings for the logged-in customer
bookingRouter.get("/", authentication, getMyBookings);

// ✅ Get booking details by ID (only owner/lister)
bookingRouter.get(
  "/:id",
  authentication,
  authorization("lister"),
  getBookingById
);

// ✅ Cancel a booking (only customer or admin)
bookingRouter.patch(
  "/:id/cancel",
  authentication,
  authorization("customer", "admin"),
  cancelBooking
);

// ✅ Update booking status (e.g. Approved, Rejected, Confirmed, etc.)
bookingRouter.patch(
  "/:id/status",
  authentication,
  authorization("lister"),
  updateBookingStatus
);

export default bookingRouter;
