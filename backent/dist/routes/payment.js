import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupons, newCoupon } from "../controllers/payment.js";
const app = express.Router();
app.post("/coupon/new", isAdmin, newCoupon);
app.get("/discount", applyDiscount);
app.get("/coupon/all", isAdmin, allCoupons);
app.delete("/coupon/:id", isAdmin, deleteCoupons);
// route - /api/v1/payment/create
app.post("/create", createPaymentIntent);
export default app;
