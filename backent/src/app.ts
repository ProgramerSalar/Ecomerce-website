import express, { NextFunction,Response, Request } from "express"

const port = 5000
const app = express()
app.use(express.json())


// Routes 
import userRoutes from "./routes/user.js"
import { connectDB } from "./utils/features.js"
import { errorMiddleware } from "./middlewares/error.js"
app.use("/api/v1/user", userRoutes)

// error middleware 
app.use(errorMiddleware)

app.listen(port, () => {
    console.log("server is start........")
})


connectDB()