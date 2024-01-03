import express from "express";
const port = 5000;
const app = express();
app.use(express.json());
// Routes 
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
app.use("/api/v1/user", userRoutes);
app.listen(port, () => {
    console.log("server is start........");
});
connectDB();
