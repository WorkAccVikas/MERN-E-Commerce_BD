import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts,
} from "../controllers/stats.js";

const app = express.Router();

// route - /api/v1/dashboard/stats
app.route("/stats").get(adminOnly, getDashboardStats);

// route - /api/v1/dashboard/pie
app.route("/pie").get(adminOnly, getPieCharts);

// route - /api/v1/dashboard/bar
app.route("/bar").get(adminOnly, getBarCharts);

// route - /api/v1/dashboard/line
app.route("/line").get(adminOnly, getLineCharts);

export default app;
