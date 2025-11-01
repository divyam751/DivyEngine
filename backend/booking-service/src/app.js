import express from "express";
import cors from "cors";
import bookingRouter from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! Booking services is running.");
});

app.use("/api/v1/booking", bookingRouter);

export default app;
