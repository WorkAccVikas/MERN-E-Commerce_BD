import { config } from "dotenv";
config({
  path: "./.env",
});

import express from "express";

// Importing Routes
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

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
app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`🚀🚀🚀 Server running : http://localhost:${port} 🚀🚀🚀`);
});
