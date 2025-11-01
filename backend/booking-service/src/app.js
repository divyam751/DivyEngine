import express from "express";
import cors from "cors";
import bookingRouter from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

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
