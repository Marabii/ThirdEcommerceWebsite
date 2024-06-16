const mongoose = require("mongoose");
require("dotenv").config();
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    productId: { type: String, required: true },
    text: { type: String, required: true },
    postedBy: { type: String, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    replies: [
      {
        text: String,
        postedBy: { type: String, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: [{ type: String, ref: "User" }],
    flags: [{ type: String, ref: "User" }],
  },
  { collection: "comments" }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = mongoose.connection;
