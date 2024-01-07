import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { MyDocument, calculatePercentage, getChartData, getInventeries } from "../utils/features.js";

export const getDashboard = TryCatch(async (req, res, next) => {
  let stats = {};
  const key = "admin-stats";
  if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

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
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    const latestTransationsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

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
      categories,
      femaleUserCounts,
      latestTransation,
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
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransationsPromise,
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
      revinew: revinew,
      user: userCount,
      product: productCount,
      order: allOrders.length,
    };

    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevinew = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creatationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creatationDate.getMonth() + 12) % 12

      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthRevinew[6 - monthDiff - 1] += order.total;
      }
    });

    // categoryCount ka Rrecord me  string or number in array
    const categoryCount = await getInventeries({ categories, productCount });

    const modifiedLatestTransation = latestTransation.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    const userRatio = {
      male: userCount - femaleUserCounts,
      female: femaleUserCounts,
    };

    stats = {
      categoryCount,
      changepercent,
      count,
      chart: {
        order: orderMonthCounts,
        revinew: orderMonthRevinew,
      },
      userRatio,
      latestTransation: modifiedLatestTransation,
    };

    myCache.set(key, JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPiChart = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";
  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productCount,
      OutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      CustomerUser,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      Order.find({}).select([
        "total",
        "discount",
        "subtotal",
        "tax",
        "shippingCharges",
      ]),
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullFillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      deliver: deliveredOrder,
    };

    const productCategoryRatio = await getInventeries({
      categories,
      productCount,
    });
    const stockAvailablity = {
      inStock: productCount - OutOfStock,
      OutOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burn = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
    const markatingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burn - markatingCost;

    const revinewDistribution = {
      netMargin,
      discount,
      productionCost,
      burn,
      markatingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: CustomerUser,
    };

    charts = {
      orderFullFillment,
      productCategoryRatio,
      stockAvailablity,
      revinewDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

// export const getBarChart = TryCatch(async (req, res, next) => {

//   let charts;
//   const key = "admin-bar-charts"


//   if(myCache.has(key)) charts = JSON.parse(myCache.get(key)!)    // same things You use as string ya null operator(!)

//   else{

//     const today = new Date();
//     const sixMonthAgo = new Date();
//     sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);


//     const twelveMonthAgo = new Date();
//     sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 12);

    


//     const lastSixMonthProductPromise = Product.find({
//       createdAt: {
//         $gte: sixMonthAgo,
//         $lte: today,
//       },
//     }).select("createdAt")
//     const lastSixMonthUsersPromise = User.find({
//       createdAt: {
//         $gte: sixMonthAgo,
//         $lte: today,
//       },
//     }).select("createdAt")
//     const lastTwelveMonthOrdersPromise = Order.find({
//       createdAt: {
//         $gte: twelveMonthAgo,
//         $lte: today,
//       },
//     }).select("createdAt")


//     const [

//       products,
//       users,
//       orders

//     ] = await Promise.all([
//       lastSixMonthProductPromise,
//       lastSixMonthUsersPromise,
//       lastTwelveMonthOrdersPromise
//     ])


//     const productCounts = getChartData({ length: 6, today, docArr: products });
//     const userCounts = getChartData({ length: 6, today, docArr: users });
//     const OrderCounts = getChartData({ length: 6, today, docArr: orders });

    






//     charts = {
//       users:userCounts,
//       products:productCounts,
//       orders:OrderCounts,
//     }

//     myCache.set(key, JSON.stringify(charts));
//   }

//   return res.status(200).json({
//     success: true,
//     charts,
//   });


// });

export const getBarChart = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  if (myCache.has(key)) charts = JSON.parse(myCache.get(key) as string);
  else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});




export const getlineChart = TryCatch(async (req, res, next) => {});
