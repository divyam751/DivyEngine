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

app.get("/health", (req, res) => {
  return apiResponse.success(res, 200, "Auth Service is healthy", {});
});

app.use("/", userRouter);

export default app;
