import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
} from "../controllers/user.auth.js";
import { authentication } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/me", authentication, checkAuth);

export default userRouter;
