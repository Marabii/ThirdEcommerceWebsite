const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connection = require("../models/products");
const Product = connection.models.Product;
const passport = require("passport");
const User = mongoose.model("User");
const connectionOrder = require("../models/orders");
const Order = connectionOrder.models.Order;
const isAdmin = require("../lib/authMiddleware.cjs");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const connectionComment = require("../models/comments");
const Comment = connectionComment.models.Comment;

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

//----Handling Saving Products----

const thumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../assets/products");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.randomId || req.params.id + ".png");
  },
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const productImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../assets/additionalImages");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.params.id + "-" + uniqueSuffix + ".png");
  },
});

const uploadImages = multer({
  storage: productImagesStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 3,
  },
});

router.post(
  "/api/addProduct",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  uploadThumbnail.single("thumbnail"),
  async (req, res) => {
    try {
      const product = new Product({
        _id: new mongoose.Types.ObjectId(req.body.randomId),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        delivery: req.body.delivery,
        stock: req.body.stock,
        category: req.body.category,
        productDetails: req.body.productDetails,
        specification: JSON.parse(req.body.specification),
        materials: JSON.parse(req.body.materials),
        tags: JSON.parse(req.body.tags),
      });

      const savedProduct = await product.save();

      res
        .status(201)
        .send({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
      console.error("Failed to add product:", error);
      res
        .status(400)
        .json({ message: "Failed to add product", error: error.message });
    }
  }
);

router.post(
  "/api/updateThumbnail/:id",
  uploadThumbnail.single("thumbnail"),
  (req, res) => {
    res.status(200).send("thumbnail uploaded successfully");
  }
);

router.post(
  "/api/addAdditionalImages/:id",
  uploadImages.array("images", 3),
  (req, res) => {
    res.status(200).send("File uploaded successfully");
  }
);

router.post(
  "/api/updateProduct/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  uploadThumbnail.none(),
  uploadImages.none(),
  async (req, res) => {
    try {
      const {
        name,
        price,
        description,
        delivery,
        stock,
        category,
        productDetails,
      } = req.body;
      if (!name || !price || !description) {
        return res
          .status(400)
          .json({ success: false, msg: "Missing required fields" });
      }

      // Prepare the product object, safely parsing JSON fields
      const product = {
        name,
        price,
        description,
        delivery,
        stock,
        category,
        productDetails,
        specification: tryParseJSON(req.body.specification),
        materials: tryParseJSON(req.body.materials),
        tags: tryParseJSON(req.body.tags),
      };

      // Use findOneAndReplace to update the product
      const data = await Product.findOneAndReplace(
        { _id: req.params.id },
        product,
        { new: true }
      );
      if (!data) {
        return res
          .status(404)
          .json({ success: false, msg: "Product not found" });
      }

      // Respond with success
      res.status(200).json({
        success: true,
        msg: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ success: false, msg: "Failed to update product" });
    }
  }
);

router.delete("/api/deleteProduct/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    // Delete additional images
    const dir = path.join(__dirname, "../assets/additionalImages");
    const images = fs.readdirSync(dir);
    images.forEach((image) => {
      if (image.startsWith(deletedProduct._id)) {
        fs.unlinkSync(path.join(dir, image));
      }
    });

    // Delete thumbnail
    const thumbnailPath = path.join(
      __dirname,
      `../assets/thumbnails/${deletedProduct._id}.png`
    );
    fs.unlinkSync(thumbnailPath);

    res
      .status(200)
      .json({ success: true, msg: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, msg: "Failed to delete product" });
  }
});

function tryParseJSON(jsonString) {
  let parsedData =
    typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
  return parsedData;
}

router.delete(
  "/api/deleteComment/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const commentId = req.params.id;
      if (!commentId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const deletedComment = await Comment.findByIdAndDelete(commentId);
      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/api/setPromo",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    const { option, itemsWithDiscount, discountForAll } = req.body;

    // Validate input
    if (
      !option ||
      (option === "specific" && !Array.isArray(itemsWithDiscount)) ||
      (option === "all" && !discountForAll)
    ) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    try {
      if (option === "all") {
        const products = await Product.find({});
        await Promise.all(
          products.map(async (product) => {
            product.promo = discountForAll;
            await product.save().catch((error) => {
              console.error(
                `Error saving product ID ${product._id}:`,
                error.message
              );
              throw new Error(
                `Failed to set promo for product ID ${product._id}`
              );
            });
          })
        );
      } else if (option === "specific") {
        await Promise.all(
          itemsWithDiscount.map(async (item) => {
            try {
              const product = await Product.findById(item.product);
              if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
              }
              product.promo = item.discount;
              await product.save().catch((error) => {
                console.error(
                  `Error saving product ID ${product._id}:`,
                  error.message
                );
                throw new Error(
                  `Failed to set promo for product ID ${product._id}`
                );
              });
            } catch (error) {
              console.error(
                `Error processing item with product ID ${item.product}:`,
                error.message
              );
              throw error;
            }
          })
        );
      }

      res.status(200).json({ message: "Promo set successfully" });
    } catch (error) {
      console.error("Error setting promo:", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

module.exports = router;
