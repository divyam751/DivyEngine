import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const carSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      unique: true,
      default: uuidv4,
      index: true,
      immutable: true,
    },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    type: {
      type: String,
      enum: ["Hatchback", "Sedan", "SUV", "Luxury", "Electric"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric"],
      required: true,
    },
    seatingCapacity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number },
    available: { type: Boolean, default: true },
    availability: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    listerId: {
      type: String,
      required: true,
    },
    listerContact: { type: String },
    images: [{ type: String, required: true }],
    location: {
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, default: "India" },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" },
      },
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    year: { type: Number, required: true },
    mileage: { type: Number },
    color: { type: String },
    features: [{ type: String }],
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Fair"],
      default: "Good",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Inactive"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
