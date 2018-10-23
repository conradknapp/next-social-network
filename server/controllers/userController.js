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

// export const userByID = (req, res, next, id) => {
//   User.findById(id)
//     .populate("following", "_id name")
//     .populate("followers", "_id name")
//     .exec((err, user) => {
//       if (err || !user)
//         return res.status("400").json({
//           error: "User not found"
//         });
//       req.profile = user;
//       next();
//     });
// };

export const read = (req, res) => {
  // req.profile.hashed_password = undefined;
  // req.profile.salt = undefined;
  res.json(req.user);
};

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId })
    .populate("following", "_id name")
    .populate("followers", "_id name");
  if (!user) {
    return res.status(404).json({
      message: "No user found"
    });
  }
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

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  res.json(deletedUser);
};

export const photo = (req, res, next) => {
  if (req.user.photo.data) {
    res.set("Content-Type", req.user.photo.contentType);
    return res.send(req.user.photo.data);
  }
  next();
};

export const defaultPhoto = (req, res) => {
  res.sendFile(process.cwd() + profileImage);
};

export const addFollowing = async (req, res, next) => {
  const { userId, followId } = req.body;
  await User.findOneAndUpdate(
    { _id: userId },
    { $push: { following: followId } }
  );
  next();
};

export const addFollower = async (req, res) => {
  const { followId, userId } = req.body;
  const result = await User.findByIdAndUpdate(
    followId,
    { $push: { followers: userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name");
  res.json(result);
};

export const removeFollowing = async (req, res, next) => {
  const { userId, unfollowId } = req.body;
  await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { following: unfollowId } }
  );
  next();
};

export const removeFollower = async (req, res) => {
  const { userId, unfollowId } = req.body;
  const result = await User.findOneAndUpdate(
    { _id: unfollowId },
    { $pull: { followers: userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name");
  res.json(result);
};

export const findPeople = async (req, res) => {
  const { following, _id } = req.user;
  following.push(_id);
  const users = await User.find({ _id: { $nin: following } }).select("name");
  res.json(users);
};
