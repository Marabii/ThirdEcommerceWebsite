const express = require("express");
const router = express.Router();
const connectionProduct = require("../models/products");
const Product = connectionProduct.models.Product;
const connectionOrder = require("../models/orders");
const Order = connectionOrder.models.Order;
const User = require("mongoose").model("User");
const passport = require("passport");
const bodyParser = require("body-parser");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.post(
  "/api/create-checkout-session",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const items = req.body.items;
    items.forEach(async (item) => {
      const product = await Product.findById(item.id);
      if (product.stock < item.quantity || product.stock === 0) {
        return res.status(400).json({ error: "Not enough stock" });
      }
    });
    const productIds = items.map((item) => item.id);
    const products = await Product.find({ _id: { $in: productIds } });
    const metadata = {
      ...req.body.metadata,
      cartItems: JSON.stringify(
        items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }))
      ),
    };
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: products.map((product) => {
          const quantity = items.filter((item) => item.id == product._id)[0]
            .quantity;

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
              },
              unit_amount: product.price * 100,
            },
            quantity: quantity,
          };
        }),
        success_url: `${process.env.FRONT_END}/successful-payment/${metadata.userId}`,
        cancel_url: `${process.env.FRONT_END}`,
        metadata: metadata,
      });
      res.json({ url: session.url });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
);

const getCartItems = async (metadata) => {
  const cartItems = JSON.parse(metadata.cartItems);
  const cart = await Promise.all(
    cartItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );
  return cart;
};

const deletCart = async (userId) => {
  const newUser = await User.findById(userId);
  newUser.cart = [];
  const user = new User(newUser);
  await user.save();
};

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.WEBHOOK_SECRET
      );
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const cartItems = await getCartItems(session.metadata);
      const newOrder = {
        cart: cartItems,
        userId: session.metadata.userId,
        status: "pending",
        shippingAddress: {
          street: session.metadata.street,
          city: session.metadata.city,
          zip: session.metadata.zipcode,
        },
        billingAddress: {
          street: session.metadata.street,
          city: session.metadata.city,
          zip: session.metadata.zipcode,
        },
        paymentDetails: {
          transactionId: session.payment_intent,
          status: "paid",
        },
        totalAmount: session.amount_total / 100,
        paymentDate: new Date(),
        orderConfirmationNumber: session.id,
      };

      deletCart(session.metadata.userId);

      try {
        const order = new Order(newOrder);
        await order.save();
        cartItems.forEach(async (item) => {
          const product = await Product.findById(item.productId);
          console.log("item: ", item);
          product.stock -= item.quantity;
          await product.save();
        });
      } catch (err) {
        console.error("Error saving order:", err);
        return response.status(500).send("Failed to create order");
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
  }
);

router.put(
  "/api/setIsSuccessfulPageSeen/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user._id;
    const orderId = req.params.id;

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).send("Order not found");
      }

      if (order.userId.toString() !== userId.toString()) {
        return res.status(401).send("Unauthorized");
      }

      order.isSuccessfulPageSeen = true;
      const updatedOrder = await order.save();
      res
        .status(200)
        .json({ isSuccessfulPageSeen: updatedOrder.isSuccessfulPageSeen });
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
