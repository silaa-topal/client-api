//defines the database
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  IDnumber: {
    type: Number,
    maxlength: 11,
    required: true,
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
  phone: {
    type: Number,
    maxlength: 11,
    required: true,
  },
  gender: {
    type: String,
    maxlength: 6,
    required: true,
  },
  age: {
    type: Number,
    maxlength: 3,
    required: true,
  },
  refreshJWT: {
    token: {
      type: String,
      maxlength: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
});

module.exports = {
  UserSchema: mongoose.model("User", UserSchema),
};
