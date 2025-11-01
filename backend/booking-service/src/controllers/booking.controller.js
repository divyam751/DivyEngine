import axios from "axios";
import Booking from "../models/booking.model.js";
import apiResponse from "../utils/apiResponse.js";
import {
  CAR_SERVICE_URL,
  INTERNAL_SERVICE_TOKEN,
  SERVICE,
} from "../utils/constant.js";
import logger from "../utils/logger.js";

/**
 * ==================================================
 * @desc Create a new booking request (Customer → Car)
 * @route POST /bookings
 * @access Customer
 * ==================================================
 */
const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;

    // ✅ Validate request body
    if (!carId || !startDate || !endDate || !totalPrice) {
      return apiResponse.error(res, 400, "Missing required booking details");
    }

    // ✅ Ensure authenticated user info is present
    if (!req.user || !req.user.publicId) {
      return apiResponse.error(res, 401, "Unauthorized: Missing user data");
    }

    // ✅ Fetch car details securely from car-service
    const carResponse = await axios.get(
      `${CAR_SERVICE_URL}/internal/${carId}`,
      {
        headers: {
          "x-internal-token": INTERNAL_SERVICE_TOKEN,
        },
      }
    );

    const carData = carResponse?.data?.data;

    if (!carData) {
      return apiResponse.error(res, 404, "Car not found in car-service");
    }

    if (carData.status !== "Approved" || !carData.available) {
      return apiResponse.error(res, 400, "Car is not available for booking");
    }

    // ✅ Create booking entry
    const newBooking = await Booking.create({
      customerId: req.user.publicId,
      carId,
      listerId: carData.listerId,
      startDate,
      endDate,
      totalPrice,
      status: "Pending", // waiting for lister approval
    });

    logger.success(SERVICE, `Booking request created: ${newBooking.publicId}`);

    return apiResponse.success(
      res,
      201,
      "Booking request created successfully",
      newBooking
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to create booking → ${error.message}`);

    // Handle car-service request failure gracefully
    if (error.response) {
      return apiResponse.error(
        res,
        error.response.status,
        error.response.data?.message || "Car-service error"
      );
    }

    return apiResponse.error(
      res,
      500,
      "Failed to create booking",
      error.message
    );
  }
};

/**
 * ==================================================
 * @desc Get all bookings made by current customer
 * @route GET /bookings/my
 * @access Customer
 * ==================================================
 */
const getMyBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.publicId) {
      return apiResponse.error(res, 401, "Unauthorized access");
    }

    const bookings = await Booking.find({ customerId: req.user.publicId }).sort(
      {
        createdAt: -1,
      }
    );

    return apiResponse.success(
      res,
      200,
      "Your bookings fetched successfully",
      bookings
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to get customer bookings → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to fetch bookings",
      error.message
    );
  }
};

/**
 * ==================================================
 * @desc Get all booking requests for a lister (to approve/reject)
 * @route GET /bookings/lister/requests
 * @access Lister
 * ==================================================
 */
const getBookingsForLister = async (req, res) => {
  try {
    if (!req.user || !req.user.publicId) {
      return apiResponse.error(res, 401, "Unauthorized access");
    }

    const listerId = req.user.publicId;
    const bookings = await Booking.find({ listerId }).sort({ createdAt: -1 });

    return apiResponse.success(
      res,
      200,
      "Lister booking requests fetched successfully",
      bookings
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to get lister bookings → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to fetch booking requests",
      error.message
    );
  }
};

/**
 * ==================================================
 * @desc Approve or reject booking (Lister only)
 * @route PATCH /bookings/:bookingId/status
 * @access Lister
 * ==================================================
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return apiResponse.error(
        res,
        400,
        "Invalid status. Must be 'Approved' or 'Rejected'"
      );
    }

    const booking = await Booking.findOne({ publicId: bookingId });

    if (!booking) {
      return apiResponse.error(res, 404, "Booking not found");
    }

    // Ensure only the correct lister can approve/reject
    if (booking.listerId !== req.user.publicId) {
      return apiResponse.error(
        res,
        403,
        "Access denied: not your booking request"
      );
    }

    booking.status = status;
    if (status === "Rejected" && rejectionReason)
      booking.rejectionReason = rejectionReason;

    await booking.save();

    logger.success(SERVICE, `Booking ${bookingId} → ${status}`);

    return apiResponse.success(res, 200, `Booking ${status}`, booking);
  } catch (error) {
    logger.error(SERVICE, `Failed to update booking → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to update booking",
      error.message
    );
  }
};

/**
 * ==================================================
 * @desc Admin — get all bookings
 * @route GET /bookings/admin/all
 * @access Admin
 * ==================================================
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return apiResponse.success(
      res,
      200,
      "All bookings fetched successfully",
      bookings
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to get all bookings → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to fetch bookings",
      error.message
    );
  }
};

/**
 * ✅ Get booking by ID
 * Accessible by: Customer who booked OR Lister who owns the car OR Admin
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.publicId;
    const userRole = req.user?.role; // assuming JWT contains role

    const booking = await Booking.findOne({ publicId: id });
    if (!booking) return apiResponse.error(res, 404, "Booking not found");

    // Access control
    if (
      userRole !== "admin" &&
      booking.customerId !== userId &&
      booking.listerId !== userId
    ) {
      return apiResponse.error(res, 403, "Access denied");
    }

    return apiResponse.success(
      res,
      200,
      "Booking retrieved successfully",
      booking
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to fetch booking → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to fetch booking",
      error.message
    );
  }
};

/**
 * ❌ Cancel booking
 * Accessible by: Customer who booked OR Admin
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.publicId;
    const userRole = req.user?.role;

    const booking = await Booking.findOne({ publicId: id });
    if (!booking) return apiResponse.error(res, 404, "Booking not found");

    // Only customer who booked or admin can cancel
    if (booking.customerId !== userId && userRole !== "admin") {
      return apiResponse.error(
        res,
        403,
        "You are not allowed to cancel this booking"
      );
    }

    // Prevent cancellation if already completed or ongoing
    if (["Completed", "Ongoing"].includes(booking.status)) {
      return apiResponse.error(
        res,
        400,
        "Cannot cancel an ongoing or completed booking"
      );
    }

    booking.status = "Cancelled";
    booking.paymentStatus = "Refunded"; // optional — depends on payment flow
    await booking.save();

    logger.success(SERVICE, `Booking ${id} cancelled successfully`);
    return apiResponse.success(
      res,
      200,
      "Booking cancelled successfully",
      booking
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to cancel booking → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to cancel booking",
      error.message
    );
  }
};

const getAllBookingsInternal = async (req, res) => {
  try {
    const bookings = await Booking.find().lean();

    logger.success(SERVICE, `Fetched ${bookings.length} bookings internally`);
    return apiResponse.success(
      res,
      200,
      "All bookings retrieved successfully (internal)",
      bookings
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to fetch all bookings → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to retrieve all bookings",
      error.message
    );
  }
};

export {
  createBooking,
  getMyBookings,
  getBookingsForLister,
  updateBookingStatus,
  getAllBookings,
  getBookingById,
  cancelBooking,
  getAllBookingsInternal,
};
