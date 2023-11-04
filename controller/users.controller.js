require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const logger = require('../logger/index');
const JWT_SECRET = process.env.JWT_SECRET;
const maxAge = 3600; // 1hr maxAge

const createToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const createUser = async (req, res) => {
  logger.info('[CreateUser] => Create User process started')
  const { first_name, last_name, email, password } = req.body;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    res.status(409).send({
      status: "FAILED",
      message: "User already created, please login",
    });
  }
  try {
    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
    });
    const token = createToken(user);

    return res.status(201).send({ status: "OK", token });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    logger.info('[LoginUser] => login process started')
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const token = createToken(user);

    return res.status(200).send({ token });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

const home = async (req, res) => {
  try {
    const blogCheck = await Blog.find().populate(
      "author",
      "-email -_id -password"
    );

    if (blogCheck.length <= 0) {
      return res.status(200).send({
        status: "OK",
        message:
          "Sorry, there are no blogs available currently, please go to https://simple-note-icoj.onrender.com/signup using postman or any other http clients.",
      });
    } else {
      res.status(200).send(blogCheck);
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: "FAILED", message: "Internal server Error" });
  }
};

module.exports = { createUser, loginUser, home };
