import { config } from "dotenv";
config({
  path: "./.env",
});

import express from "express";

// Importing Routes
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";

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

// Error middleware
app.use((err, req, res, next) => {
  console.log("Error Middleware = ", err);
  return res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`🚀🚀🚀 Server running : http://localhost:${port} 🚀🚀🚀`);
});
