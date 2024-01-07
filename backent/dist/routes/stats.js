import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { getBarChart, getDashboard, getPiChart, getlineChart } from "../controllers/stats.js";
const app = express.Router();
// route - /api/v1/dashboard/stats 
app.get("/stats", isAdmin, getDashboard);
// route - /api/v1/dashboard/pi
app.get("/pi", isAdmin, getPiChart);
// route - /api/v1/dashboard/bar
app.get("/bar", isAdmin, getBarChart);
// route - /api/v1/dashboard/line
app.get("/line", isAdmin, getlineChart);
export default app;
