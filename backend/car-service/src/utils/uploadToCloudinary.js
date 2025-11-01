import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "./logger.js";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "./constant.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "car_images",
      resource_type: "image",
    });

    // Remove local file after successful upload
    fs.unlinkSync(filePath);
    logger.success(
      "UPLOAD",
      `Image uploaded successfully: ${result.secure_url}`
    );

    return result.secure_url;
  } catch (error) {
    logger.error("UPLOAD", `Cloudinary upload failed: ${error.message}`);
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
    throw new Error("Image upload failed");
  }
};

export default uploadToCloudinary;
