// middlewares/internalAuthMiddleware.js

import apiResponse from "../utils/apiResponse.js";

/**
 * Middleware to protect internal routes between microservices.
 * Uses a shared internal token (not JWT).
 */
const internalAuthMiddleware = (req, res, next) => {
  try {
    const internalToken = req.headers["x-internal-token"];

    if (!internalToken) {
      return apiResponse.error(
        res,
        401,
        "Unauthorized: Missing internal token"
      );
    }

    if (internalToken !== process.env.INTERNAL_SERVICE_TOKEN) {
      return apiResponse.error(
        res,
        403,
        "Forbidden: Invalid internal service token"
      );
    }

    next();
  } catch (error) {
    return apiResponse.error(
      res,
      500,
      "Internal authentication failed",
      error.message
    );
  }
};

export default internalAuthMiddleware;
