const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");
const md5 = require('md5');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email is required"
    },
    name: {
      type: String,
      trim: true,
      required: "Name is required"
    },
    about: {
      type: String,
      trim: true
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },
    // updatedAt: Date,
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
// Gives us a better 'unique' error (rather than 11000 duplicate key)
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
