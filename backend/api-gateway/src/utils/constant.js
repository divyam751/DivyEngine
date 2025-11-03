import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const SERVICE = "API-GATEWAY";
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const CAR_SERVICE_URL = process.env.CAR_SERVICE_URL;
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL;

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

export {
  PORT,
  SERVICE,
  AUTH_SERVICE_URL,
  CAR_SERVICE_URL,
  BOOKING_SERVICE_URL,
  CLIENT_ORIGIN,
};
