const Blog = require("../models/blog.model");
const User = require("../models/user.model");

const calculateReadingTime = (text) => {
  const wpm = 200;
  const wordcount = text ? text.split(/\s+/).length : 0;
  return (readingTimeMinutes = Math.ceil(wordcount / wpm));
};

const createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;
  const userId = req.userId;

  const user = await User.findOne({ _id: userId });

  if (!user)
    return res
      .status(404)
      .json({ status: "FAILED", message: "User not found" });

  const existingBlog = await Blog.findOne({ title });
  if (existingBlog) {
    res.status(409).send({
      status: "FAILED",
      message:
        "A blog with this title already exists, please input another title",
    });
  }
  try {
    const newBlog = await Blog.create({
      title,
      description,
      tags,
      author: userId,
      timestamp: Date.now(),
      read_count: 0,
      reading_time: calculateReadingTime(body),
      body,
    });

    const populatedName = await Blog.findById(newBlog._id).populate(
      "author",
      "-email -_id -password"
    );
    // const authorName = `${populatedName.author.first_name} ${populatedName.author.last_name}`;
    res.status(201).send({
      status: "OK",
      message: "New Blog created",
      newBlog: populatedName.toObject(),
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  const { title, description, tags, body, state } = req.body;
  const { blogId } = req.params;
  const userId = req.userId; //make sure it is owner of blog

  try {
    const blog = await Blog.findById(blogId).populate("author");
    if (!blog)
      return res
        .status(404)
        .send({ status: "FAILED", message: "Blog not found" });

    if (
      !blog.author ||
      !blog.author._id ||
      blog.author._id.toString() !== userId.toString()
    ) {
      console.log("blog Author", blog.author._id, userId);
      return res.status(403).send({
        status: "FAILED",
        message: "You are not authorized to update a blog",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        description,
        tags,
        body,
        author: userId,
        state,
      },
      { new: true }
    );
    if (!updatedBlog) {
      return res
        .status(404)
        .send({ status: "FAILED", message: "Updated blog not found" });
    }

    res.send({ status: "OK", message: "Blog updated", blog: updatedBlog });
  } catch (error) {
    console.error("error updating", error);
    res
      .status(500)
      .send({ status: "FAILED", message: "internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  const userId = req.userId;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .send({ status: "FAILED", message: "Blog not found" });

    if (
      !blog.author ||
      !blog.author._id ||
      blog.author._id.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({
          error: "Unauthorized: Only Owner of blog can delete this blog",
        });
    }
    //delete blog
    await Blog.findByIdAndDelete(blogId);

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ status: "FAILED", message: "Internal Server Error" });
  }
};

const myBlogs = async (req, res) => {
  const userId = req.userId;
  const { page = 1, limit = 20, state } = req.query;
  //   console.log(req.query);
  try {
    const query = {
      author: userId,
      ...Blog(state && { state }), //inlcude state filter if provided
    };

    //find blog
    const blogs = await Blog.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 20));

    res.send({ blogs });
  } catch (error) {
    res
      .status(500)
      .send({ status: "FAILED", message: "Internal server error" });
  }
};

module.exports = { createBlog, updateBlog, deleteBlog, myBlogs };
