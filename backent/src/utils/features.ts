import mongoose from "mongoose";
import { invalidateCacheProps } from "../types/types.js";



export const connectDB = () => {
    
    try{
        const database = mongoose.connect(process.env.MONGO_DB as string, 
   { dbName:"Ecomerce-2024"}
    ).then(
        (c) => console.log('Database is Connected......')
    )
    }catch(error){
        console.log(error)
    }
}




