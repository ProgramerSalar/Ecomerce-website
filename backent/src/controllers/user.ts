import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";



export const register = TryCatch(
    async (
        req: Request<{},{},NewUserRequestBody>,
        res: Response,
        next: NextFunction
      ) => {
      
        //   throw new Error("some error")
          const {name,email,photo,gender,role,_id,dob} = req.body;
          const user = await User.create({
              name,email,photo,gender,role,_id,dob
          });
          res.status(200).json({
            success: true,
            message: `Welcome ${user.name}`,
          });
       
      }
)
