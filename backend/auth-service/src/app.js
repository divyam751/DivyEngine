import cors from "cors";
import express from "express";
import userRouter from "./routes/user.routes.js";
import apiResponse from "./utils/apiResponse.js";
import { CLIENT_ORIGIN } from "./utils/constant.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOption = {
  origin: CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOption));

app.get("/", (req, res) => {
  return apiResponse.success(res, 200, "Welcome to Auth Service API", {});
});
app.get("/health", (req, res) => {
  return apiResponse.success(res, 200, "Auth Service is healthy", {});
});

app.use("/api/v1/auth", userRouter);

export default app;
