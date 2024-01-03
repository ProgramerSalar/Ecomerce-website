import express from "express";
const port = 5000;
const app = express();
// Routes 
import userRoutes from "./routes/user.js";
app.use("/api/v1/user", userRoutes);
app.listen(port, () => {
    console.log("server is start........");
});
