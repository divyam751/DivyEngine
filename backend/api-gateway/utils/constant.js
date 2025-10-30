import dotenv from "dotenv";
dotenv.config();


export const PORT = process.env.PORT || 3000;
export const SERVICE = "API-GATEWAY";
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const CAR_SERVICE_URL = process.env.CAR_SERVICE_URL;
export const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL;


