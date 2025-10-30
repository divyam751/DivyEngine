import cors from "cors";
import express from "express";
import userRouter from "./routes/user.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! from Auth Service");
});

app.use("/api/v1/users", userRouter);

export default app;
