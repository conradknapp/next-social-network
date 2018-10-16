import User from "../models/User";
import formidable from "formidable";
import fs from "fs";
import _ from "lodash";
import profileImage from "./profile-image.jpg";

const getUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({ error: err.message || err.toString() });
    }
    res.status(200).json(users);
  }).select("name email updated created");
};

const userByID = (req, res, next, id) => {
  User.findById(id)
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, user) => {
      if (err || !user)
        return res.status("400").json({
          error: "User not found"
        });
      req.profile = user;
      next();
    });
};

const read = (req, res) => {
  req.profile.hashed_password = null;
  req.profile.salt = null;
  return res.status(200).json(req.profile);
};

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.sendStatus(403);
  }
  return res.status(200).json(user);
};

const updateUser = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  if (!deletedUser) {
    return res.status(400).json({ error: "User could not be deleted" });
  }
  res.status(200).json(deletedUser);
};

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + profileImage);
};

const addFollowing = (req, res, next) => {
  const { userId, followId } = req.body;
  User.findByIdAndUpdate(
    userId,
    { $push: { following: followId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      next();
    }
  );
};

const addFollower = (req, res) => {
  const { followId, userId } = req.body;
  User.findByIdAndUpdate(
    followId,
    { $push: { followers: userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

const removeFollowing = (req, res, next) => {
  const { userId, unfollowId } = req.body;
  User.findByIdAndUpdate(
    userId,
    { $pull: { following: unfollowId } },
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      next();
    }
  );
};

const removeFollower = (req, res) => {
  const { userId, unfollowId } = req.body;
  User.findByIdAndUpdate(
    unfollowId,
    { $pull: { followers: userId } },
    { new: true }
  )
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

const findPeople = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find({ _id: { $nin: following } }, (err, users) => {
    if (err) {
      return res.status(400).json({
        error: "Error"
      });
    }
    res.json(users);
  }).select("name");
};

export default {
  getUsers,
  userByID,
  getUserProfile,
  read,
  findPeople,
  updateUser,
  deleteUser,
  photo,
  defaultPhoto,
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing
};
