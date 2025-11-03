import express from "express";
import cors from "cors";
import bookingRouter from "./routes/booking.routes.js";
import cookieParser from "cookie-parser";
import { CLIENT_ORIGIN } from "./utils/constant.js";
import { authentication } from "./middlewares/authMiddleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOption = {
  origin: CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOption));

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Welcome to the Booking Service" });
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Booking Service is healthy" });
});

app.use("/api/v1/booking", bookingRouter);

export default app;
