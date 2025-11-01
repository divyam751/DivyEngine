import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 3001;
const SERVICE = "AUTH-SERVICE";

export { MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, DB_NAME, PORT, SERVICE };
