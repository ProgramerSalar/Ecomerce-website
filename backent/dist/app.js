import express from "express";
const port = 5000;
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Routes 
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoutes from "./routes/product.js";
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
// error middleware 
app.use(errorMiddleware);
app.listen(port, () => {
    console.log("server is start........");
});
connectDB();
