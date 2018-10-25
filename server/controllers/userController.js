import mongoose from "mongoose";
import formidable from "formidable";
import fs from "fs";
import _ from "lodash";
import profileImage from "./profile-image.jpg";

const User = mongoose.model("User");

export const getUsers = async (req, res) => {
  const users = await User.find({}).select("name email updatedAt createdAt");
  res.json(users);
};

export const getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id })
    .populate("following", "_id name")
    .populate("followers", "_id name");
  req.profile = user;
  next();
  // .exec((err, user) => {
  //   if (err || !user)
  //     return res.status("400").json({
  //       error: "User not found"
  //     });
  //   req.profile = user;
  //   next();
  // });
};

export const getMe = (req, res) => {
  // req.profile.hashed_password = undefined;
  // req.profile.salt = undefined;
  res.json(req.user);
};

export const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId })
    .populate("following", "_id name")
    .populate("followers", "_id name");
  console.log({ user });
  // if (!user) {
  //   return res.status(404).json({
  //     message: "No user found"
  //   });
  // }
  res.json(user);
};

export const updateUser = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    let user = req.user;
    user = _.extend(user, fields);
    user.updatedAt = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  });
};

export const removeUser = async (req, res) => {
  const { userId } = req.params;
  if (userId !== req.user._id) {
    return res.status(403).json({
      message: "You are not authorized to perform this action"
    });
  }
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  res.json(deletedUser);
};

export const getImage = (req, res, next) => {
  if (req.user.photo.data) {
    res.set("Content-Type", req.user.photo.contentType);
    return res.send(req.user.photo.data);
  }
  next();
};

export const getDefaultImage = (req, res) => {
  res.sendFile(`${process.cwd()}${profileImage}`);
};

export const addFollowing = async (req, res, next) => {
  const { authUserId, followId } = req.body;
  await User.findOneAndUpdate(
    { _id: authUserId },
    { $push: { following: followId } }
  );
  next();
};

export const addFollower = async (req, res) => {
  const { authUserId, followId } = req.body;
  const result = await User.findOneAndUpdate(
    { _id: followId },
    { $push: { followers: authUserId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name");
  res.json(result);
};

export const removeFollowing = async (req, res, next) => {
  const { authUserId, followId } = req.body;
  await User.findOneAndUpdate(
    { _id: authUserId },
    { $pull: { following: followId } }
  );
  next();
};

export const removeFollower = async (req, res) => {
  const { authUserId, followId } = req.body;
  const result = await User.findOneAndUpdate(
    { _id: followId },
    { $pull: { followers: authUserId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name");
  res.json(result);
};

export const findUsers = async (req, res) => {
  const { following, _id } = req.user;
  following.push(_id);
  const users = await User.find({ _id: { $nin: following } }).select("name");
  res.json(users);
};
