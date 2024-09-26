const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("mongoose").model("User");

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
