import express from "express"
import { deleteUser, getAllUser, getUser, register } from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";
import { getBarChart, getDashboard, getPiChart, getlineChart } from "../controllers/stats.js";


const app = express.Router()


// route - /api/v1/dashboard/stats 
app.get("/stats", getDashboard)


// route - /api/v1/dashboard/pi
app.get("/pi", getPiChart)

// route - /api/v1/dashboard/bar
app.get("/bar", getBarChart)

// route - /api/v1/dashboard/line
app.get("/line", getlineChart)

export default app;