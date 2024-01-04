import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please ENter Name"],
    },
    photo: {
        type: String,
        required: [true, "Please ENTer Photo"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter Price"],
    },
    stock: {
        type: Number,
        required: [true, "Please Enter STock"],
    },
    category: {
        type: String,
        required: [true, "Please Enter Category"],
        trim: true, // white space remove 
    },
}, { timestamps: true });
export const Product = mongoose.model("Product", schema);
