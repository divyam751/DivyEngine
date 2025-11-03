import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 3002;
const SERVICE = "CAR-SERVICE";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

export {
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DB_NAME,
  PORT,
  SERVICE,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLIENT_ORIGIN,
};
