import mongoose from "mongoose";
import mongodbErrorHandler from "mongoose-mongodb-errors";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
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
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }]
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });
// Gives us a better 'unique' error (rather than 11000 duplicate key)
UserSchema.plugin(mongodbErrorHandler);

export default mongoose.model("User", UserSchema);
