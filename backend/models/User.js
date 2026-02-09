const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 2,
    max: 20,
    trim: true,
  },
  password: {
    type: String,
    min: 5,
    max: 15,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    min: 11,
    max: 35,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
