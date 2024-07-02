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

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);

const app = express();

// middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

// Server static file
app.use("/uploads", express.static("uploads"));

// Error middleware
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`🚀🚀🚀 Server running : http://localhost:${port} 🚀🚀🚀`);
});
