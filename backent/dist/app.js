import express from "express";
import NodeCache from "node-cache";
import { config } from "dotenv";
const port = 5000;
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
config({
    path: ".env",
});
export const myCache = new NodeCache();
// Routes 
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoutes from "./routes/product.js";
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
// error middleware 
app.use(errorMiddleware);
app.listen(process.env.PORT, () => {
    console.log("server is start........");
});
connectDB();
