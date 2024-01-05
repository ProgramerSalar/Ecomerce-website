import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboard = TryCatch(async (req, res, next) => {
  let stats = {};
  const key = "admin-stats";
  if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6)


    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), -1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    // products
    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gt: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gt: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // user
    const thisMonthUserPromise = User.find({
      createdAt: {
        $gt: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthUserPromise = User.find({
      createdAt: {
        $gt: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // orders
    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gt: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gt: lastMonth.start,
        $lte: lastMonth.end,
      },
    });


    // last six month order 
    const lastSixMonthOrderPromise = Order.find({
        createdAt:{
            $gte:sixMonthAgo,
            $lte:today,
        }
    })

    const [
      thisMonthProducts,
      thisMonthUser,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUser,
      lastMonthOrders,
      productCount,
      userCount,
      allOrders,
      lastSixMonthOrders,
      categories
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUserPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUserPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise,
      Product.distinct("category")
      
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changepercent = {
      revenew: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revinew = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
        revinew:revinew,
        user:userCount,
        product:productCount,
        order:allOrders.length
    }

    const orderMonthCounts = new Array(6).fill(0)
    const orderMonthRevinew = new Array(6).fill(0)

    lastSixMonthOrders.forEach((order) => {

        const creatationDate = order.createdAt
        const monthDiff = today.getMonth() - creatationDate.getMonth()

        if(monthDiff < 6){
            orderMonthCounts[6-monthDiff-1] += 1;
            orderMonthRevinew[6-monthDiff-1] += order.total;
        }
    })

    const categoriesCountPromise = categories.map((category) => Product.countDocuments({category}))
    const categoriesCount = await Promise.all(categoriesCountPromise)
    const categoryCount:Record<string,number>[] = []    // categoryCount ka Rrecord me  string or number in array
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]:Math.round((categoriesCount[i] / productCount) * 100)
        })
    })

    stats = {
        categoryCount,
      changepercent,
      count,
      chart:{
        order:orderMonthCounts,
        revinew:orderMonthRevinew
      }
    };
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPiChart = TryCatch(async (req, res, next) => {});

export const getBarChart = TryCatch(async (req, res, next) => {});

export const getlineChart = TryCatch(async (req, res, next) => {});
