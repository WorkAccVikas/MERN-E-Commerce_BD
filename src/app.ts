import { config } from "dotenv";
config({
  path: "./.env",
});

import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

import NodeCache from "node-cache";
import morgan from "morgan";

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);

const app = express();

export const myCache = new NodeCache();

// middleware
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// Server static file
app.use("/uploads", express.static("uploads"));

// Error middleware
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`🚀🚀🚀 Server running : http://localhost:${port} 🚀🚀🚀`);
});
