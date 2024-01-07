import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import { ErrorHandler } from "../utils/utility-class.js";
export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount)
        return next(new ErrorHandler("Please Enter Amount fields", 404));
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});
export const newCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new ErrorHandler("Please Enter Both fields", 404));
    await Coupon.create({ code: coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created Successfully`,
    });
});
export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    if (!coupon)
        return next(new ErrorHandler("Please Enter Coupon", 401));
    const discount = await Coupon.findOne({
        code: coupon,
    });
    if (!discount)
        return next(new ErrorHandler("Invalid Coupon Code", 400));
    return res.status(200).json({
        success: true,
        discount: discount.amount,
    });
});
export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons,
    });
});
export const deleteCoupons = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupons = await Coupon.findByIdAndDelete(id);
    if (!coupons)
        return next(new ErrorHandler("Invalid Coupon", 401));
    return res.status(200).json({
        success: true,
        message: "Coupon Deleted Successfully",
    });
});
