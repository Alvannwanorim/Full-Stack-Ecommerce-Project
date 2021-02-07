import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productsRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/cloudinary.js";
import { errorHanlder, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "2mb" }));

connectDB();

app.get("/", (req, res) => {
  res.send("API is Running...");
});

app.use("/api/products", productRoutes);
app.use("/api/user", userRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const PORT = process.env.PORT;

app.use(notFound);
app.use(errorHanlder);

app.listen(
  PORT,
  console.log(
    `sever running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
