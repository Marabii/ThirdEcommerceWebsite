const mongoose = require("mongoose");
require("dotenv").config();

// Define a sub-schema for specifications
const SpecificationSchema = new mongoose.Schema(
  {
    weight: {
      type: Number,
      required: true, // Assuming weight is always required
      min: 0, // Ensure weight cannot be negative
    },
    width: {
      type: Number,
      required: true,
      min: 0,
    },
    height: {
      type: Number,
      required: true,
      min: 0,
    },
    length: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
); // Disable _id for sub-document if not necessary

// Main Product schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true, // Removes padding spaces
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
  specification: SpecificationSchema, // Use the defined SpecificationSchema
  materials: {
    type: [String], // Array of Strings
    default: [],
  },
  tags: {
    type: [String], // Array of Strings
    default: [],
  },
});

const Product = mongoose.model("Product", ProductSchema);

// Expose the connection
module.exports = mongoose.connection;
