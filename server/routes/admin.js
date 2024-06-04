const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connection = require("../models/products");
const Product = connection.models.Product;
const passport = require("passport");
const User = require("mongoose").model("User");
const connectionOrder = require("../models/orders");
const Order = connectionOrder.models.Order;
const isAdmin = require("../lib/authMiddleware.cjs");

router.get(
  "/api/verifyAdmin",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    });
  }
);

router.get(
  "/api/monthly-revenues",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    const currentYear = new Date().getFullYear();
    const revenues = await Order.aggregate([
      {
        $match: {
          "paymentDetails.status": "paid",
          paymentDate: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $project: {
          month: { $month: { $toDate: "$paymentDate" } },
          totalAmount: 1,
        },
      },
      {
        $group: {
          _id: "$month",
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Initialize an array of 12 elements all set to 0
    let monthlyTotals = new Array(12).fill(0);

    // Fill the array with the revenue data received
    revenues.forEach((item) => {
      monthlyTotals[item._id - 1] = item.totalAmount;
    });

    res.json(monthlyTotals);
  }
);

router.get(
  "/api/most-purchased-products",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const topProducts = await Order.aggregate([
        { $unwind: "$cart" }, // Flatten the cart array
        {
          $group: {
            _id: "$cart.productId", // Group by productId
            totalQuantity: { $sum: "$cart.quantity" }, // Sum up all quantities for each product
          },
        },
        { $sort: { totalQuantity: -1 } }, // Sort by totalQuantity in descending order
        { $limit: 10 }, // Limit to top 10
      ]);

      // Extract only product IDs
      const productIds = topProducts.map((product) => product._id);

      res.json(productIds);
    } catch (error) {
      console.error("Failed to fetch most purchased products:", error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
