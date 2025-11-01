import cors from "cors";
import express from "express";
import userRouter from "./routes/user.routes.js";
import apiResponse from "./utils/apiResponse.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return apiResponse.success(res, 200, "Welcome to Auth Service API", {});
});
app.get("/health", (req, res) => {
  return apiResponse.success(res, 200, "Auth Service is healthy", {});
});

app.use("/api/v1/user", userRouter);

export default app;
