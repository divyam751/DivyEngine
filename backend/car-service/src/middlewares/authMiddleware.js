import jwt from "jsonwebtoken";
import apiResponse from "../utils/apiResponse.js";
import { JWT_SECRET } from "../utils/constant.js";

// ✅ Authentication: verifies token & extracts user
const authentication = (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return apiResponse.error(
        res,
        401,
        "Unauthorized: Missing or malformed token"
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // decoded should contain user data (publicId, email, role, etc.)
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token expired. Please log in again."
        : "Invalid token";
    return apiResponse.error(res, 401, message);
  }
};

// ✅ Authorization: checks if user's role is allowed
const authorization = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return apiResponse.error(res, 401, "Unauthorized: No role assigned");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return apiResponse.error(
        res,
        403,
        `Access denied: Only ${allowedRoles.join(", ")} can perform this action`
      );
    }

    next();
  };
};

export { authentication, authorization };
