import express from "express";
import cors from "cors";
import carRouter from "./routes/car.routes.js";
import cookieParser from "cookie-parser";
import { CLIENT_ORIGIN } from "./utils/constant.js";

const app = express();
app.use(cookieParser());
const corsOption = {
  origin: CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOption));

app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Welcome to the Car Service" });
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Car Service is healthy" });
});

app.use("/api/v1/car", carRouter);

export default app;
