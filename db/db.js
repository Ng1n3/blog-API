require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;
const connect = async (url) => {
  mongoose.connect(MONGO_URL);

  mongoose.connection.on("connected", () => {
    console.log("connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to DB", err);
  });
};

module.exports = { connect };