import express from "express";
import cors from "cors";
import carRouter from "./routes/car.routes.js";

const app = express();

app.use(cors());
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
