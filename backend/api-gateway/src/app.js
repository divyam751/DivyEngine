import cors from "cors";
import express from "express";
import apiResponse from "./utils/apiResponse.js";

import { createProxyMiddleware } from "http-proxy-middleware";
import {
  AUTH_SERVICE_URL,
  BOOKING_SERVICE_URL,
  CAR_SERVICE_URL,
  CLIENT_ORIGIN,
} from "./utils/constant.js";

const app = express();
app.use(cookieParser());

const corsOption = {
  origin: CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());

// -------------------------
// API Gateway routes
// -------------------------

// Auth routes
app.use(
  "/api/v1/user",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      apiResponse.error(res, 502, "Service unavailable");
    },
  })
);

// Car routes
app.use(
  "/api/v1/cars",
  createProxyMiddleware({
    target: CAR_SERVICE_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      apiResponse.error(res, 502, "Service unavailable");
    },
  })
);

// Booking routes
app.use(
  "/api/v1/bookings",
  createProxyMiddleware({
    target: BOOKING_SERVICE_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      apiResponse.error(res, 502, "Service unavailable");
    },
  })
);

app.get("/", (req, res) => {
  apiResponse.success(res, 200, "Welcome to the API Gateway");
});

app.get("/health", (req, res) => {
  apiResponse.success(res, 200, "API Gateway is healthy");
});

// 404 handler
app.use((req, res) => {
  apiResponse.error(res, 404, "Route not found");
});

export default app;
