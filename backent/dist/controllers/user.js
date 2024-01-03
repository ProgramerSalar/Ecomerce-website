import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
export const register = TryCatch(async (req, res, next) => {
    //   throw new Error("some error")
    const { name, email, photo, gender, role, _id, dob } = req.body;
    const user = await User.create({
        name, email, photo, gender, role, _id, dob
    });
    res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
    });
});
