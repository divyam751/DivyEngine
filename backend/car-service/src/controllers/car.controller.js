import path from "path";
import fs from "fs";
import logger from "../utils/logger.js";
import Car from "../models/car.model.js";
import { SERVICE } from "../utils/constant.js";
import apiResponse from "../utils/apiResponse.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { fileURLToPath } from "url";

// create a new car listing
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to safely delete local file
const deleteLocalFile = (file) => {
  try {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      logger.warn("CLEANUP", `Deleted unused local file: ${file.path}`);
    }
  } catch (err) {
    logger.error("CLEANUP", `Failed to delete local file: ${err.message}`);
  }
};

const createCar = async (req, res) => {
  let uploadedImage = null;
  let imageUrl = null;
  try {
    if (!req.user || !req.user.publicId) {
      deleteLocalFile(req.file);
      return apiResponse.error(
        res,
        401,
        "Unauthorized: Missing user information"
      );
    }

    // ✅ Parse location JSON safely
    let location = {};
    if (req.body.location) {
      try {
        location = JSON.parse(req.body.location);
      } catch (err) {
        deleteLocalFile(req.file);
        return apiResponse.error(res, 400, "Invalid location format");
      }
    }

    // ✅ Validate required fields
    const requiredFields = [
      "name",
      "brand",
      "type",
      "transmission",
      "fuelType",
      "seatingCapacity",
      "pricePerDay",
      "registrationNumber",
      "year",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        deleteLocalFile(req.file);
        return apiResponse.error(res, 400, `Missing required field: ${field}`);
      }
    }

    if (!location.city) {
      deleteLocalFile(req.file);
      return apiResponse.error(
        res,
        400,
        "Missing required field: location.city"
      );
    }

    const registrationNumber = req?.body?.registrationNumber
      ?.trim()
      .toUpperCase();
    const existingCar = await Car.findOne({ registrationNumber });

    if (existingCar) {
      deleteLocalFile(req.file); // 🧹 Clean up unused local image
      logger.error(
        SERVICE,
        `Duplicate Request! Registration Number already exists: ${registrationNumber}`
      );
      return apiResponse.error(
        res,
        400,
        `This car (${registrationNumber}) is already registered.`,
        ["Duplicate Request!"]
      );
    }

    // ✅ Upload image to Cloudinary
    if (req.file) {
      const localPath = path.join(__dirname, "../uploads", req.file.filename);
      uploadedImage = await uploadToCloudinary(localPath);
      imageUrl = uploadedImage?.url;
    } else {
      return apiResponse.error(res, 400, "Missing required field: image");
    }

    // ✅ Build Car Data
    const carData = {
      name: req.body.name,
      brand: req.body.brand,
      type: req.body.type,
      transmission: req.body.transmission,
      fuelType: req.body.fuelType,
      seatingCapacity: req.body.seatingCapacity,
      pricePerDay: req.body.pricePerDay,
      pricePerHour: req.body.pricePerHour || null,
      availability: req.body.availability
        ? JSON.parse(req.body.availability)
        : {},
      mileage: req.body.mileage,
      color: req.body.color,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      condition: req.body.condition || "Good",
      registrationNumber,
      year: req.body.year,
      location,
      images: imageUrl ? [imageUrl] : [],
      listerId: req.user.publicId,
      listerContact: req.user.contact || null,
    };

    const newCar = await Car.create(carData);

    logger.success(SERVICE, `Car listed successfully: ${newCar._id}`);
    return apiResponse.success(res, 201, "Car listed successfully", newCar);
  } catch (error) {
    logger.error(SERVICE, `Failed to list car → ${error.message}`);
    deleteLocalFile(req.file); // 🧹 Fallback cleanup
    return apiResponse.error(res, 500, "Failed to list car", error.message);
  }
};

export default createCar;

// get your listed cars by listerId

const getMyListedCars = async (req, res) => {
  try {
    if (!req.user?.publicId) {
      logger.warn(SERVICE, "Unauthorized attempt to access listed cars");
      return apiResponse.error(
        res,
        401,
        "Unauthorized: Missing user information"
      );
    }

    const listerId = req.user.publicId;

    // ✅ Extract query parameters
    const {
      page = 1,
      limit = 10,
      status, // Optional filter (e.g., Pending, Approved)
      search, // Optional keyword search (name, brand, type)
    } = req.query;

    const skip = (page - 1) * limit;

    // ✅ Build dynamic filters
    const filters = { listerId };
    if (status) filters.status = status;

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Query DB
    const [listedCars, totalCars] = await Promise.all([
      Car.find(filters)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      Car.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalCars / limit);

    // ✅ Respond
    return apiResponse.success(res, 200, "Listed cars retrieved successfully", {
      totalCars,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
      listedCars,
    });
  } catch (error) {
    logger.error(SERVICE, `Failed to retrieve listed cars → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to retrieve listed cars",
      error.message
    );
  }
};

// get all listed cars (admin only)
const getAllListedCars = async (req, res) => {
  try {
    // ✅ Only admin should access this
    if (!req.user || req.user.role !== "admin") {
      logger.warn(SERVICE, "Unauthorized admin access attempt");
      return apiResponse.error(res, 403, "Access denied: Admins only");
    }

    // ✅ Extract query parameters
    const {
      page = 1,
      limit = 10,
      status, // Optional filter
      search, // Optional keyword search (brand, name, type)
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (page - 1) * limit;

    // ✅ Build filters dynamically
    const filters = {};
    if (status) filters.status = status;

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Sorting configuration
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // ✅ Fetch data in parallel for performance
    const [cars, totalCars] = await Promise.all([
      Car.find(filters).sort(sort).skip(Number(skip)).limit(Number(limit)),
      Car.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalCars / limit);

    // ✅ Return paginated response
    return apiResponse.success(res, 200, "Cars retrieved successfully", {
      totalCars,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
      cars,
    });
  } catch (error) {
    logger.error(SERVICE, `Failed to retrieve all cars → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to retrieve all cars",
      error.message
    );
  }
};

// get available cars for booking (customers)

const getAvailableCarsForBooking = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "customer") {
      logger.warn(SERVICE, "Unauthorized attempt to access available cars");
      return apiResponse.error(res, 403, "Access denied: Customers only");
    }

    // ✅ Extract query params
    const {
      page = 1,
      limit = 10,
      city,
      brand,
      type,
      transmission,
      fuelType,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const skip = (page - 1) * limit;

    // ✅ Build filters dynamically
    const filters = {
      available: true, // Only available cars
      status: "Approved", // Only admin-approved listings
    };

    if (city) filters["location.city"] = { $regex: city, $options: "i" };
    if (brand) filters.brand = { $regex: brand, $options: "i" };
    if (type) filters.type = type;
    if (transmission) filters.transmission = transmission;
    if (fuelType) filters.fuelType = fuelType;

    // ✅ Price filter (optional)
    if (minPrice || maxPrice) {
      filters.pricePerDay = {};
      if (minPrice) filters.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filters.pricePerDay.$lte = Number(maxPrice);
    }

    // ✅ Keyword search (name or brand)
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Query DB
    const [cars, totalCars] = await Promise.all([
      Car.find(filters)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      Car.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(totalCars / limit);

    return apiResponse.success(
      res,
      200,
      "Available cars retrieved successfully",
      {
        totalCars,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit),
        cars,
      }
    );
  } catch (error) {
    logger.error(
      SERVICE,
      `Failed to retrieve available cars → ${error.message}`
    );
    return apiResponse.error(
      res,
      500,
      "Failed to retrieve available cars",
      error.message
    );
  }
};

/**
 * @desc Get all pending cars (for admin)
 * @route GET /api/cars/admin/pending
 * @access Admin only
 */
const getPendingCarsForApproval = async (req, res) => {
  try {
    const pendingCars = await Car.find({ status: "Pending" });
    return apiResponse.success(
      res,
      200,
      "Pending car requests retrieved successfully",
      pendingCars
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to fetch pending cars → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to fetch pending cars",
      error.message
    );
  }
};

/**
 * @desc Approve or reject car listing
 * @route PATCH /api/cars/admin/:carId/status
 * @access Admin only
 */
const updateCarStatusByAdmin = async (req, res) => {
  try {
    const { carId } = req.params;
    const { status, message } = req.body; // status: "Approved" | "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return apiResponse.error(res, 400, "Invalid status provided");
    }

    const car = await Car.findById(carId);
    if (!car) {
      return apiResponse.error(res, 404, "Car not found");
    }

    car.status = status;
    car.adminMessage = message || null;

    if (status === "Approved") {
      car.isAvailable = true; // car is live for booking
    } else {
      car.isAvailable = false;
    }

    await car.save();

    logger.success(
      SERVICE,
      `Admin ${status.toLowerCase()} car listing → ${car._id}`
    );

    return apiResponse.success(
      res,
      200,
      `Car ${status.toLowerCase()} successfully`,
      car
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to update car status → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to update car status",
      error.message
    );
  }
};

/**
 * @desc Lister update and resubmit car details
 * @route PUT /api/cars/:carId
 * @access Lister only
 */
const updateCarDetailsByLister = async (req, res) => {
  try {
    const { carId } = req.params;
    const listerId = req.user?.publicId;
    const updatedData = req.body;

    if (!listerId) {
      return apiResponse.error(res, 401, "Unauthorized access");
    }

    const car = await Car.findById(carId);
    if (!car) {
      return apiResponse.error(res, 404, "Car not found");
    }

    // Ensure lister owns this car
    if (car.listerId !== listerId) {
      return apiResponse.error(res, 403, "Access denied: not your car");
    }

    // Merge updates
    Object.assign(car, updatedData);

    // If car was already approved, resubmission required
    if (car.status === "Approved") {
      car.status = "Pending";
      car.isAvailable = false; // hide until reapproved
      car.adminMessage = "Resubmission for approval";
    }

    await car.save();

    logger.success(
      SERVICE,
      `Car ${carId} updated and resubmitted for approval by lister ${listerId}`
    );

    return apiResponse.success(
      res,
      200,
      "Car updated successfully. Pending admin approval.",
      car
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to update car details → ${error.message}`);
    return apiResponse.error(
      res,
      500,
      "Failed to update car details",
      error.message
    );
  }
};

// ✅ Internal API for other microservices to get limited car info
const getCarDetailsForInternal = async (req, res) => {
  try {
    const { carId } = req.params;

    const car = await Car.findOne(
      { publicId: carId },
      "publicId listerId status available"
    );

    if (!car) {
      return apiResponse.error(res, 404, "Car not found");
    }

    return apiResponse.success(
      res,
      200,
      "Car details fetched successfully",
      car
    );
  } catch (error) {
    logger.error(SERVICE, `Failed to fetch car details → ${error.message}`);
    return apiResponse.error(res, 500, "Internal server error", error.message);
  }
};

export {
  createCar,
  getMyListedCars,
  getAllListedCars,
  getAvailableCarsForBooking,
  getPendingCarsForApproval,
  updateCarStatusByAdmin,
  updateCarDetailsByLister,
  getCarDetailsForInternal,
};
