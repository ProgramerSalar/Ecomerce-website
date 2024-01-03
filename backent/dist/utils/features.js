import mongoose from "mongoose";
export const connectDB = () => {
    try {
        const database = mongoose.connect('mongodb+srv://udamy_user:vfVjiniUHSosqrV2@cluster0.8r3vhxn.mongodb.net/?retryWrites=true&w=majority', { dbName: "Ecomerce-2024" }).then((c) => console.log('Database is Connected......'));
    }
    catch (error) {
        console.log(error);
    }
};
