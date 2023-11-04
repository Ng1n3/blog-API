require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const JWT_SECRET = process.env.JWT_SECRET;
const maxAge = 3 * 24 * 60 * 60;

//handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", first_name: "", last_name: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "password provided is incorrect";
  }

  //Duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is alread registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const createToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const createUser = async (req, res) => {
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
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(201).send({ status: "OK", token });
  } catch (error) {
    // const errors = handleErrors(error);
    res.status(400).send({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user);
    console.log("DECOded token: ", jwt.decode(token));
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(200).send({ token });
  } catch (error) {
    // const errors = handleErrors(error);
    res.status(400).json({ error: error.message });
  }
};

const home = async (req, res) => {
  try {
    const blogCheck = await Blog.find().populate(
      "author",
      "-email -_id -password"
    );
    // const blogs = blogCheck.map((blog) => {
    //   return {
    //     ...blogCheck.toObject(),
    //     authorName: `${blog.author.first_name} ${blog.author.last_name}`,
    //   };
    // });
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
