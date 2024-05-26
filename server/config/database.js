require("dotenv").config();
const mongoose = require("mongoose");
const uri = process.env.DB_STRING;

const connectDB = async () => {
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to Atlas"))
    .catch((err) => console.error("Initial connection error: ", err));
};

module.exports = { connectDB };
