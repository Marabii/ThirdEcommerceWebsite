const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connection = require("../models/products");
const Product = connection.models.Product;
const passport = require("passport");
const User = require("mongoose").model("User");

// router.get('/api/getLandingPageSlider', (req, res) => {
//     fs.readdir(path.join(__dirname, '../assets/products'), (err, data) => {
//         if (err) {
//             console.log('Error reading files', err);
//             res.status(404).send('Files not found');
//         } else {
//             res.status(200).json(data);
//         }
//     });
// });

router.get("/api/getProducts", async (req, res) => {
  const limit = Number(req.query.limit) || 10; // Default limit to 10 if not provided
  const skip = Number(req.query.skip) || 0; // Default skip to 0 if not provided
  const categoryFilter = String(req.query.filter);
  const isCard = req.query.isCard === "true";
  const projection = { _id: 1, name: 1, price: 1, promo: 1 };
  let query = {};

  if (categoryFilter !== "all") {
    query["category"] = categoryFilter;
  }

  try {
    // Get total count for the current filter
    const totalCount = await Product.countDocuments(query);

    // Define the projection based on isCard flag
    const dataProjection = isCard ? { ...projection, category: 1 } : projection;

    // Fetch data with applied limit and skip, and projection
    const data = await Product.find(query, dataProjection)
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

module.exports = router;
