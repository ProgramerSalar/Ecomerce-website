import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    // if(!shippingInfo || !orderItems || !user || !subtotal || !tax || !shippingCharges || !discount || !total)
    // return next(new ErrorHandler("Please Enter all Fields", 401))

    if (!shippingInfo)
      return next(new ErrorHandler("Please Enter Shipping Info", 404));
    if (!orderItems)
      return next(new ErrorHandler("Please Enter orderItems", 404));
    if (!user) return next(new ErrorHandler("Please Enter userId", 404));
    if (!subtotal) return next(new ErrorHandler("Please Enter subtotal", 404));
    if (!tax) return next(new ErrorHandler("Please Enter Tax", 404));
    if (!shippingCharges)
      return next(new ErrorHandler("Please Enter shippingCharges", 404));
    if (!discount) return next(new ErrorHandler("Please Enter discount", 404));
    if (!total) return next(new ErrorHandler("Please Enter total", 404));

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems);
    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });
    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  }
);

export const myOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: user } = req.query;
    let orders = [];
    if (myCache.has(`my-orders-${user}`))
      orders = JSON.parse(myCache.get(`my-orders-${user}`) as string);
    else {
      orders = await Order.find({ user: user });
      myCache.set(`my-orders-${user}`, JSON.stringify(orders));
    }

    return res.status(201).json({
      success: true,
      orders,
    });
  }
);

export const AllOrders = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const key = `all-orders`;
    let orders = [];
    if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
    else {
      orders = await Order.find({}).populate("user", "name");
      myCache.set(key, JSON.stringify(orders));
    }

    return res.status(201).json({
      success: true,
      orders,
    });
  }
);

export const getSingleOrder = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const key = `order-${id}`;

    let order;
    if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
    else {
      order = await Order.findById(id).populate("user", "name");
      if (!order) return next(new ErrorHandler("Order Not Found", 404));
      myCache.set(key, JSON.stringify(order));
    }

    return res.status(201).json({
      success: true,
      order,
    });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(201).json({
    success: true,
    message: "Order Proccessed Successfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();
  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  return res.status(201).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});