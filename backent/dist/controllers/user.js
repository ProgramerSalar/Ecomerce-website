import { User } from "../models/user.js";
export const register = async (req, res, next) => {
    try {
        const {} = req.body;
        const user = await User.create({});
        res.status(200).json({
            success: true,
            message: `Welcome ${user.name}`
        });
    }
    catch (error) {
    }
};
