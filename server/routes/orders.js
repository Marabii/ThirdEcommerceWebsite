const express = require("express");
const router = express.Router();
const passport = require("passport");
const connectionOrder = require("../models/orders");
const Order = connectionOrder.models.Order;

router.get(
  "/api/getRecentOrder",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Find the most recent order by this user and sort by 'createdAt' in descending order
      let recentOrder;
      try {
        recentOrder = await Order.findOne({ userId: req.user._id })
          .sort({ createdAt: -1 })
          .select("createdAt isSuccessfulPageSeen")
          .limit(1);
      } catch (error) {
        console.error("Error fetching recent order:", error);
        return res.status(500).send("Internal server error");
      }
      if (!recentOrder) {
        console.log("No recent order found for user:", req.user._id);
        return res.status(404).send("No orders found for this user");
      }

      // Check if an order was found
      if (recentOrder) {
        res.status(200).json(recentOrder);
      } else {
        res.status(404).send("No orders found for this user");
      }
    } catch (e) {
      // Handle potential errors in querying the database
      res.status(500).send("Error fetching order");
    }
  }
);

router.get(
  "/api/getOrdersData",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    try {
      const order = await Order.find({ userId });
      if (!order) {
        return res.status(404).send("No orders found for this user");
      }
      res.status(200).json(order);
    } catch (e) {
      console.error("getOrdersData error: ", e);
      res.status(500).send("Internal server error");
    }
  }
);

router.get(
  "/api/getOrder/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const orderConfirmationNumber = req.params.id;
    try {
      const order = await Order.findOne({ orderConfirmationNumber });

      if (!order) {
        return res.status(404).send("Order not found");
      }

      if (order.userId != req.user._id) {
        console.log("Order found, but not for the logged in user");
        return res.status(401).send("Unauthorized");
      }

      res.status(200).json(order);
    } catch (e) {
      console.error("getOrder error: ", e);
      res.status(500).send("Internal server error");
    }
  }
);

router.get(
  "/api/getRecentOrder",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Find the most recent order by this user and sort by 'createdAt' in descending order
      let recentOrder;
      try {
        recentOrder = await Order.findOne({ userId: req.user._id })
          .sort({ createdAt: -1 })
          .select("createdAt isSuccessfulPageSeen")
          .limit(1);
      } catch (error) {
        console.error("Error fetching recent order:", error);
        return res.status(500).send("Internal server error");
      }
      if (!recentOrder) {
        console.log("No recent order found for user:", req.user._id);
        return res.status(404).send("No orders found for this user");
      }

      // Check if an order was found
      if (recentOrder) {
        res.status(200).json(recentOrder);
      } else {
        res.status(404).send("No orders found for this user");
      }
    } catch (e) {
      // Handle potential errors in querying the database
      res.status(500).send("Error fetching order");
    }
  }
);

module.exports = router;
