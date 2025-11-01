// Helper to capitalize the first letter of a string

const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const apiResponse = {
  success: (res, statusCode = 200, message = "", data = {}) => {
    return res.status(statusCode).json({
      status: "success",
      message: capitalizeFirstLetter(message),
      data,
    });
  },

  error: (res, statusCode = 500, message = "", errors = []) => {
    return res.status(statusCode).json({
      status: "error",
      message: capitalizeFirstLetter(message),
      errors: Array.isArray(errors)
        ? errors.map((err) => capitalizeFirstLetter(err))
        : [capitalizeFirstLetter(errors)],
    });
  },
};

export default apiResponse;
