import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add Photo", 401));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("deleted");
        });
        return next(new ErrorHandler("please Enter All Fields", 401));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res.status(201).json({
        success: true,
        message: "Product Created Successfully"
    });
});
export const getLatestProduct = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({
        createdAt: -1
    }).limit(5);
    return res.status(400).json({
        success: true,
        products
    });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category"); // unique category are show
    return res.status(200).json({
        success: true,
        categories
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({
        createdAt: -1
    });
    return res.status(400).json({
        success: true,
        products
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    return res.status(200).json({
        success: true,
        product
    });
});
export const UpdateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product Not FOund", 401));
    if (photo) {
        rm(product.photo, // old photo deleted 
        () => {
            console.log("old photo deleted");
        });
        product.photo = photo.path; // new photo added 
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(201).json({
        success: true,
        message: "Product Updated Successfully"
    });
});
export const DeletedProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product Not FOund", 401));
    rm(product.photo, // photo deleted 
    () => {
        console.log("product photo deleted");
    });
    await product.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Product Delted Successfully"
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
});
