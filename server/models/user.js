const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a sub-schema for cart items
const CartItemSchema = new Schema(
  {
    productId: {
      type: String,
      ref: "Product", // Assuming a Product model exists
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Minimum quantity should be at least 1
    },
  },
  { _id: false }
);

// Define a sub-schema for email verification code
const EmailVerificationCodeSchema = new Schema(
  {
    code: {
      type: String,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
); // Setting _id: false to avoid generating a separate ID for the sub-document

// Main User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true, // Removes whitespace around the username
    unique: true, // Ensures usernames are unique across the collection
    index: true, // Indexes this field for faster query performance
  },
  hash: {
    type: String,
    required: [true, "Password hash is required"],
  },
  salt: {
    type: String,
    required: [true, "Salt is required for password hashing"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true, // Converts email to lowercase to avoid case-sensitive issues
    match: [/.+\@.+\..+/, "Please fill a valid email address"], // Regex pattern to validate email
    index: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: [CartItemSchema],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: EmailVerificationCodeSchema, // Use the defined sub-schema
});

// Create the model from the schema
const User = mongoose.model("User", UserSchema);

module.exports = User; // Export the model
