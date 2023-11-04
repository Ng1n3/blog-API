const joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/user.model");

const ValidUserCreation = async (req, res, next) => {
  try {
    const schema = joi.object({
      first_name: joi.string().required(),
      last_name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(422).json({
      status: "FAILED",
      error: error.message,
    });
  }
};

const loginValidation = async (req, res, next) => {
  try {
    const schema = joi.object({
      password: joi.string().required(),
      email: joi.string().email().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(422).json({
      messasge: error.message,
      status: "FAILED",
    });
  }
};

const checkuser = (req, res, next) => {
  console.log("PING");
  const tokenheader = req.header("Authorization");
  // console.log(tokenheader);
  if (!tokenheader || !tokenheader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = tokenheader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ status: "FAILED", message: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).send({ status: "FAILED", message: "INVALID TOKEN" });
  }
};

module.exports = {
  ValidUserCreation,
  loginValidation,
  checkuser,
};
