import express from "express"
import { deleteUser, getAllUser, getUser, register } from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";


const app = express.Router()



// http://localhost:5000/api/v1/user
app.post("/new", register)
app.get("/all",isAdmin, getAllUser)
app.route("/:id").get(getUser).delete(isAdmin,deleteUser)

export default app;