// models/Blog.js
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a title for your blog"],
    unique: true,
    minlength: [3, "Your title must have a minimum of 3 characters"],
  },
  description: {
    type: String,
    minlength: [
      5,
      "Your description must have a minumum length of 5 characters",
    ],
  },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  timestamp: { type: Date, default: Date.now },
  state: { type: String, enum: ["draft", "published"], default: "draft" },
  read_count: { type: Number, default: 0 },
  reading_time: Number,
  body: {
    type: String,
    required: [true, "Enter a body for your blog"],
    minlength: [5, "Your body must have a minimum length of 5 characters"],
  },
});

blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
