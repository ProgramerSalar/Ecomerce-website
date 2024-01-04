import express from "express";
import { deleteUser, getAllUser, getUser, register } from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";
const app = express.Router();
app.post("/new", register);
app.get("/all", isAdmin, getAllUser);
app.route("/:id").get(getUser).put().delete(isAdmin, deleteUser);
export default app;
