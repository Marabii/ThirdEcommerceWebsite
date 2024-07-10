const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connection = require("../models/products");
const Product = connection.models.Product;
const passport = require("passport");
const User = require("mongoose").model("User");
const connectionOrder = require("../models/orders");
const Order = connectionOrder.models.Order;
const sendEmail = require("../lib/email").sendEmail;
const { searchProductsWithAlgolia } = require("../lib/algoliaSearch");
const path = require("path");
const fs = require("fs");

router.get("/api/getProducts", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;
  const categoryFilter = String(req.query.filter).toLowerCase();
  const isCard = req.query.isCard === "true";
  const sort = req.query.sort || "price-desc"; // Default sort order
  const projection = { _id: 1, name: 1, price: 1, promo: 1, stock: 1 };
  const material = req.query.material;

  let query = {};
  if (categoryFilter !== "all") {
    query["category"] = categoryFilter;
  } else if (material && material.toLowerCase() !== "all") {
    query["materials"] = material;
  }

  // Sorting logic
  const sortOptions = {};
  const [field, order] = sort.split("-");
  sortOptions[field] = order === "desc" ? -1 : 1;

  try {
    // Get total count for the current filter
    const totalCount = await Product.countDocuments(query);

    // Define the projection based on isCard flag
    const dataProjection = isCard ? { ...projection, category: 1 } : projection;

    // Fetch data with applied limit, skip, projection, and sort
    const data = await Product.find(query, dataProjection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.setHeader("X-Total-Count", totalCount);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(404).end("Can't get data from the server");
  }
});

router.get("/api/getProduct/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) {
      console.log("No product found for ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

router.get("/api/exploreAll", (req, res) => {
  Product.find({})
    .then((products) => {
      const tagsSet = new Set();
      const categoriesSet = new Set();
      const materialsSet = new Set();

      products.forEach((product) => {
        if (tagsSet.size < 10) {
          product.tags.forEach((tag) => {
            if (tagsSet.size < 10) tagsSet.add(tag);
          });
        }

        if (materialsSet.size < 10) {
          product.materials.forEach((material) => {
            if (materialsSet.size < 10) materialsSet.add(material);
          });
        }

        if (categoriesSet.size < 10) {
          categoriesSet.add(product.category);
        }
      });

      res.status(200).json({
        tags: Array.from(tagsSet),
        categories: Array.from(categoriesSet),
        materials: Array.from(materialsSet),
      });
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      res.status(500).json({
        error: "Failed to retrieve data. Please try again later.",
      });
    });
});

router.post(
  "/api/updateCart",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const isNewItem = req.query.isNewItem;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).send("Product ID and quantity are required.");
    }

    if (isNewItem === "true") {
      // Find the user by ID and update their cart
      User.findById(req.user._id)
        .then((user) => {
          if (!user) {
            console.error("User not found.");
            return res.status(404).send("User not found.");
          } else {
            // Check if the product already exists in the cart
            const existingItemIndex =
              user?.cart?.findIndex((item) => item.productId === productId) ||
              -1;
            if (existingItemIndex > -1) {
              // Product exists, update quantity
              user.cart[existingItemIndex].quantity += quantity;
            } else {
              // Product does not exist, add new item
              user.cart.push({ productId, quantity });
            }

            // Save the updated user
            user
              .save()
              .then((updatedUser) => res.send(updatedUser.cart))
              .catch((e) => {
                console.error("Error updating user cart:", e);
                res.status(500).send("Failed to update cart");
              });
          }
        })
        .catch((e) => {
          console.error("Database error:", e);
          res.status(500).send("Internal server error");
        });
    } else if (isNewItem === "false") {
      User.findById(req.user._id)
        .then((user) => {
          if (!user) {
            console.log("update cart error : ", "user not found");
            return res.status(404).send("user not found");
          }

          // Find the cart item
          const cartItem = user.cart.find(
            (item) => item.productId === productId
          );
          if (cartItem) {
            // Update the quantity if the product is found
            // Ensure quantity is an integer
            cartItem.quantity = parseInt(quantity);
            if (isNaN(cartItem.quantity)) {
              return res.status(400).send("Invalid quantity provided");
            }
          } else {
            // Handle the case where the product is not found in the cart
            return res.status(404).send("Product not found in cart");
          }

          // Save the user document with updated cart
          user
            .save()
            .then(() => res.status(200).send("Changed quantity successfully"))
            .catch((e) => {
              console.error("Error saving the user cart:", e);
              res.status(500).send("Failed to update cart");
            });
        })
        .catch((e) => {
          console.error("Database error:", e);
          res.status(500).send("Internal Server Error");
        });
    } else {
      res.status(401).send("What do you think you're doing");
    }
  }
);

router.get("/api/verifyUser", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    console.log("verification api ran");
    if (err) {
      res.status(500).send("An internal error occured");
    }
    if (!user) {
      // If authentication failed, user will be false
      res.json({ isLoggedIn: false });
    } else {
      User.findById(user._id).then((data) => {
        const cartItems = data.cart;
        res.status(200).json({ isLoggedIn: true, cartItems: cartItems });
      });
    }
  })(req, res, next);
});

router.get(
  "/api/getUserCart/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const productId = req.params.id;

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Find the cart item for the specified product
      const cartItem = user.cart.find((item) => item.productId === productId);

      if (!cartItem) {
        return res.status(404).send({ message: "Product not found in cart" });
      }

      res.json({ quantity: cartItem.quantity });
    } catch (e) {
      console.error("Error getting user cart", e);
      res.status(500).send("Error processing your request");
    }
  }
);

router.delete(
  "/api/deleteCartItem/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const productId = req.params.id;
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      // Update the cart by filtering out the product to delete
      user.cart = user.cart.filter(
        (product) => product.productId !== productId
      );

      // Save the updated user
      const updatedUser = await user.save();

      res.status(200).json({ cartItems: updatedUser.cart });
    } catch (e) {
      console.error(e); // Log the error to the console for debugging
      res.status(500).send("internal server error");
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

router.get(
  "/api/getUserData/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.params.id;
    try {
      const userData = await User.find(
        { _id: userId },
        { username: 1, email: 1, isEmailVerified: 1, isAdmin: 1 }
      );
      if (userData) {
        res.status(200).json(userData);
      } else {
        res.status(404).send("no user found");
      }
    } catch (e) {
      console.error("getUserData", e);
      res.status(500).send("Internal server error");
    }
  }
);

router.get(
  "/api/verifyEmail",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, userId } = req.query;

    if (!email || !userId) {
      return res.status(400).send("Missing email or user ID");
    }

    try {
      // Generate a random verification code
      const randomString = (Math.random() + 1).toString(36).substring(5);

      // Find user by ID and update the email verification code
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      // Set the new email verification code and the creation date
      user.emailVerificationCode = {
        code: randomString,
        dateCreated: new Date(), // Sets the current date and time
      };

      await user.save();

      // Uncomment and configure the sendEmail call as necessary
      sendEmail(
        "Email Verification",
        "Your verification code is: " + randomString,
        "emailVerification",
        [],
        email
      );

      res.status(200).send("Verification code sent.");
    } catch (error) {
      console.error("Error in verifying email:", error);
      res.status(500).send("Internal server error");
    }
  }
);

router.get(
  "/api/verifyEmailCode",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { code: codeFromUser, userId } = req.query;

    if (!codeFromUser || !userId) {
      return res.status(400).send("Missing code or user ID");
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      const { code: storedCode, dateCreated } = user.emailVerificationCode;
      if (!storedCode || !dateCreated) {
        return res.status(404).send("No verification code found");
      }

      const now = new Date();
      const timeDiff = now - new Date(dateCreated); // Convert dateCreated to Date object if not already

      if (timeDiff > 5 * 60 * 1000) {
        // 5 minutes in milliseconds
        user.emailVerificationCode = {}; // Clear the verification code object
        await user.save();
        return res.status(400).send("Verification code has expired");
      }

      if (storedCode !== codeFromUser) {
        return res.status(401).send("Incorrect verification code");
      }

      user.isEmailVerified = true;
      user.emailVerificationCode = {}; // Optionally clear the code after successful verification
      await user.save();
      return res.status(200).send("Email verified successfully");
    } catch (error) {
      console.error("Error verifying email code:", error);
      return res.status(500).send("Internal server error");
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

router.get("/api/search", async (req, res) => {
  const query = req.query.query;
  try {
    const results = await searchProductsWithAlgolia(query);
    res.json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching for products", error: error });
  }
});

router.get("/api/getAdditionalImages/:id", async (req, res) => {
  const id = req.params.id;
  const additionalImagesPath = path.join(
    __dirname,
    "../assets/additionalImages"
  );

  try {
    const files = await fs.promises.readdir(additionalImagesPath);
    const filteredFiles = files.filter((file) => file.startsWith(id));
    res.json(filteredFiles);
  } catch (error) {
    console.error("Failed to read directory or process files:", error);
    res.status(500).send("Error retrieving image files");
  }
});

router.get("/api/most-purchased-products", async (req, res) => {
  try {
    // Step 1: Aggregate to get top 10 most purchased product IDs
    const topProducts = await Order.aggregate([
      { $unwind: "$cart" },
      {
        $group: {
          _id: { $toObjectId: "$cart.productId" }, // Convert to ObjectId if needed
          totalQuantity: { $sum: "$cart.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      { $project: { _id: 1 } }, // Only return the _id field
    ]);

    // Step 2: Validate these IDs against the Product collection
    const productIds = topProducts.map((product) => product._id);
    const validProducts = await Product.find({
      _id: { $in: productIds },
    }).select("_id"); // Select only _id to check existence

    const validProductIds = validProducts.map((product) => product._id);

    res.json(validProductIds);
  } catch (error) {
    console.error("Failed to fetch most purchased products:", error);
    res.status(500).send("Server error");
  }
});

router.post(
  "/api/updateUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (user.email !== email) {
        user.isEmailVerified = false;
      }
      user.name = name;
      user.email = email;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
