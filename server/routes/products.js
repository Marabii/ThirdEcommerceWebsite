const express = require("express");
const router = express.Router();
const connection = require("../models/products");
const mongoose = require("mongoose");
const Product = connection.models.Product;
const connectionOrder = require("../models/orders");
const Order = connectionOrder.models.Order;
const { searchProductsWithAlgolia } = require("../lib/algoliaSearch");
const axios = require('axios');

router.get("/api/getProducts", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;
  const categoryFilter = String(req.query.filter).toLowerCase();
  const isCard = req.query.isCard === "true";
  const sort = req.query.sort || "price-desc"; // Default sort order
  const projection = {
    _id: 1,
    name: 1,
    price: 1,
    promo: 1,
    stock: 1,
    productThumbnail: 1,
  };
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

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ObjectId:", id);
    return res.status(400).json({ message: "Invalid product ID" });
  }

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

router.post('/api/get-rate', async (req, res) => {
  try {
    const { targetCurrency } = req.body;

    if (!targetCurrency) {
      return res.status(400).json({ error: 'Please provide a target currency.' });
    }

    // Wise API details
    const WISE_API_URL = `${process.env.WISE_LINK}/v1/rates?source=SAR&target=${targetCurrency}`;
    const API_TOKEN = process.env.WISE_API_TOKEN;

    // Call the Wise API
    const response = await axios.get(WISE_API_URL, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    // Return the rate information from Wise API
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching rate from Wise API.' });
  }
});

module.exports = router;
