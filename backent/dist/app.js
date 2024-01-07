import express from "express";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
// Routes
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payment.js";
import dashboardRoutes from "./routes/stats.js";
const port = 5000;
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
config({
    path: ".env",
});
app.use(morgan("dev"));
export const stripe = new Stripe(process.env.STRIPE_KEY);
export const myCache = new NodeCache();
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
// error middleware
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
    console.log("server is start........");
});
connectDB();
