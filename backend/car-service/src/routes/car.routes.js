import express from "express";

import {
  authentication,
  authorization,
} from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";
import internalAuthMiddleware from "../middlewares/internalAuthMiddleware.js";
import {
  createCar,
  getAllListedCars,
  getAvailableCarsForBooking,
  getCarDetailsForInternal,
  getMyListedCars,
  getPendingCarsForApproval,
  updateCarDetailsByLister,
  updateCarStatusByAdmin,
} from "../controllers/car.controller.js";

const carRouter = express.Router();

/* -------------------- LISTER ROUTES -------------------- */

// ✅ Create new car listing
carRouter.post(
  "/",
  authentication,
  authorization("lister"),
  upload.single("image"),
  createCar
);

// ✅ Get cars listed by the current lister
carRouter.get(
  "/my-listed-cars",
  authentication,
  authorization("lister"),
  getMyListedCars
);

// ✅ Update & resubmit car details (re-approval required if already approved)
carRouter.put(
  "/:carId",
  authentication,
  authorization("lister"),
  upload.single("image"),
  updateCarDetailsByLister
);

/* -------------------- ADMIN ROUTES -------------------- */

// ✅ Get all pending cars waiting for approval
carRouter.get(
  "/admin/pending",
  authentication,
  authorization("admin"),
  getPendingCarsForApproval
);

// ✅ Approve or reject a car listing
carRouter.patch(
  "/admin/:carId/status",
  authentication,
  authorization("admin"),
  updateCarStatusByAdmin
);

// ✅ Get all cars listed in the system (regardless of status)
carRouter.get(
  "/admin/all-cars",
  authentication,
  authorization("admin"),
  getAllListedCars
);

/* -------------------- CUSTOMER ROUTES -------------------- */

// ✅ Get all available (approved) cars for booking
carRouter.get(
  "/available-cars",
  authentication,
  authorization("customer"),
  getAvailableCarsForBooking
);

// -------------------- INTERNAL MICROSERVICE ROUTES -------------------- //
carRouter.get(
  "/internal/:carId",
  internalAuthMiddleware,
  getCarDetailsForInternal
);

export default carRouter;
