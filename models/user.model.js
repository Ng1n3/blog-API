const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    lowerCase: true,
    required: [true, "Please enter your first name"],
  },
  last_name: {
    type: String,
    lowerCase: true,
    required: [true, "Please enter your last name"],
  },
  email: { type: String, unique: true },
  password: {
    type: String,
    minlength: [6, "minimum password length is 6 characters"],
    required: [true, "please enter your password"],
  },
});

// hash password before save
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password before login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect Email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;