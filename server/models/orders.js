const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema(
  {
    productId: {
      type: String,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false }
);

const OrdersSchema = new Schema(
  {
    cart: [CartItemSchema],
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    paymentDetails: {
      transactionId: { type: String, required: true },
      status: {
        type: String,
        enum: ["paid", "failed", "pending"],
        default: "pending",
      },
    },
    totalAmount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    orderConfirmationNumber: { type: String, required: true },
    isSuccessfulPageSeen: { type: Boolean, default: false },
  },
  { collection: "orders", timestamps: true }
);

const Order = mongoose.model("Order", OrdersSchema);

module.exports = mongoose.connection;
