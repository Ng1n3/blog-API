const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./v1/users.route");
const cookieParser = require("cookie-parser");
const app = express();
const db = require('./db/db')

db.connect();

//middlewares
app.use(express.json());
// app.use(cookieParser());

//routes
app.use(userRoute);


const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.listen(PORT, () => {
  console.log(
    `App is listening on localhost://${PORT}\n Ctrl-C to shut server down`
  );
});


