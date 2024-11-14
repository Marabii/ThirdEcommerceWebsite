const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

// Main Product schema
const ProductSchema = new mongoose.Schema({
  _id: { type: ObjectId },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Product price cannot be negative"],
  },
  description: {
    type: String,
    trim: true,
  },
  delivery: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"],
    default: 0, // Default value if none is provided
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  productDetails: {
    type: String,
    trim: true,
  },
  materials: {
    type: [String], // Array of Strings
    default: [],
  },
  tags: {
    type: [String], // Array of Strings
    default: [],
  },
  specification: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  reviews: {
    type: Number,
    min: [0, "Reviews cannot be negative"],
    max: [5, "Reviews cannot be greater than 5"],
    default: 0,
  },
  promo: {
    type: Number,
    min: [0, "Promo cannot be negative"],
    max: [100, "Promo cannot be greater than 100%"],
    default: 0,
  },
  numberOfOrders: {
    type: Number,
    min: [0, "Number of Orders cannot be negative"],
    default: 0,
  },
});

const Product = mongoose.model("Product", ProductSchema);

// Expose the connection
module.exports = mongoose.connection;
