import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const bookingSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      default: uuidv4,
      index: true,
      immutable: true,
    },

    // Who booked the car (customer)
    customerId: {
      type: String,
      required: true,
      index: true,
    },

    // The car that was booked
    carId: {
      type: String,
      required: true,
      index: true,
    },

    // Lister who owns the car
    listerId: {
      type: String,
      required: true,
    },

    // Booking time frame
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    // Total rental amount (calculated from pricePerDay/hour)
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Booking workflow
    status: {
      type: String,
      enum: [
        "Pending", // waiting for lister approval
        "Approved", // lister approved
        "Rejected", // lister rejected
        "Confirmed", // customer confirmed (after payment)
        "Ongoing", // car picked up
        "Completed", // booking ended
        "Cancelled", // cancelled by customer or admin
      ],
      default: "Pending",
    },

    // Optional: payment tracking
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },

    // Optional messages
    rejectionReason: {
      type: String,
      maxlength: 200,
    },
    notes: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
