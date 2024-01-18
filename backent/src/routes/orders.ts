import express from "express"
import { isAdmin } from "../middlewares/auth.js";
import { AllOrders, deleteOrder, getSingleOrder, myOrder, newOrder, processOrder } from "../controllers/order.js";


const app = express.Router()


//  /api/v1/orders
app.post("/new", newOrder)
app.get("/my", myOrder )
app.get("/all", isAdmin, AllOrders)
app.route("/:id").get(isAdmin,getSingleOrder).put(isAdmin,processOrder).delete(isAdmin,deleteOrder)

export default app;