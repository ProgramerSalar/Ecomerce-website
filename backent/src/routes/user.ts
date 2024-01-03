import express from "express"
import { register } from "../controllers/user.js";


const app = express.Router()

app.post("/new", register)

export default app;