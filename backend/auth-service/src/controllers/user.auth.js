import logger from "../utils/logger.js";
import User from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";

const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      return apiResponse.error(res, 400, "All fields are required", [
        "Bad Request - Missing Fields",
      ]);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiResponse.error(res, 409, "Email already in use", [
        "Conflict - Duplicate Email",
      ]);
    }

    const newUser = new User({ fullname, email, password, role });
    await newUser.save();

    return apiResponse.success(res, 201, "User registered successfully", {
      publicId: newUser.publicId,
    });
  } catch (error) {
    logger.error("UserAuth-Register", `Registration Error: ${error.message}`);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return apiResponse.error(res, 400, "Validation Error", messages);
    }
    return apiResponse.error(res, 500, "Server Error", [error.message]);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return apiResponse.error(res, 400, "Email and password are required", [
        "Bad Request - Missing Credentials",
      ]);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return apiResponse.error(res, 401, "Invalid email or password", [
        "Unauthorized - Invalid Credentials",
      ]);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return apiResponse.error(res, 401, "Invalid email or password", [
        "Unauthorized - Invalid Credentials",
      ]);
    }

    const token = user.generateAuthToken();

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/", // 👈 ensures all routes can access the cookie
    });

    return apiResponse.success(res, 200, "Login successful", {
      user: user.fullname,
    });
  } catch (error) {
    logger.error("UserAuth-Login", `Login Error: ${error.message}`);
    return apiResponse.error(res, 500, "Server Error", [error.message]);
  }
};

const logout = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/", // must match the login cookie path
    });

    return apiResponse.success(res, 200, "Logout successful");
  } catch (error) {
    logger.error("UserAuth-Logout", `Logout Error: ${error.message}`);
    return apiResponse.error(res, 500, "Server Error", [error.message]);
  }
};

const checkAuth = async (req, res) => {
  try {
    return apiResponse.success(res, 200, "User varified successfully", {
      user: req.user.fullname,
    });
  } catch (error) {
    logger.error("UserAuth-checkAuth", `CheckAuth Error: ${error.message}`);
    return apiResponse.error(res, 500, "Server Error", [error.message]);
  }
};

export { register, login, logout, checkAuth };
