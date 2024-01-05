import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    
    shippingInfo:{
        address:{
            type:String,
            required:[true, "Please Enter Addresss"],
        }, 
        city:{
            type:String,
            required:[true, "Pleae Enter City"]
        },
        state:{
            type:String,
            required:[true, "Please Enter State"]
        },
        country:{
            type:String,
            required:[true, "Please Enter Country"]
        },
        pinCode:{
            type:String,
            required:[true,"Please ENter PinCode"]
        }
    },
    user:{
        type:String,
        ref:"User",
        required:true,
    },
    subtotal:{
        type:Number,
        required:true,
    },
    tax:{
        type:Number,
        required:true,
    },
    shippingCharges:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        
    },
    total:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["Processing", "Shipped", "Delivered"],
        default:"Processing"
    },
    orderItems:[{
        name:String,
        photo:String,
        price:Number,
        quantity:Number,
        productId:{
            type:mongoose.Types.ObjectId,
            ref:"Product",
        }
    }]

    
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", schema);
