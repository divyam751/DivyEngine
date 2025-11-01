import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 3003;
const INTERNAL_SERVICE_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;
const SERVICE = "BOOKING-SERVICE";
const CAR_SERVICE_URL = process.env.CAR_SERVICE_URL;

export {
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DB_NAME,
  PORT,
  SERVICE,
  INTERNAL_SERVICE_TOKEN,
  CAR_SERVICE_URL,
};
