import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
export const connectDB = () => {
    try {
        const database = mongoose
            .connect(process.env.MONGO_DB, { dbName: "Ecomerce-2024" })
            .then((c) => console.log("Database is Connected......"));
    }
    catch (error) {
        console.log(error);
    }
};
export const invalidateCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKeys = [
            "latest-product",
            "categories",
            "all-products",
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            productKeys.push(`product-${i._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let index = 0; index < orderItems.length; index++) {
        const order = orderItems[index];
        const product = await Product.findById(order.productId);
        if (!product)
            throw (new Error("Product Not Found"));
        product.stock -= order.quantity;
        await product.save();
    }
};
