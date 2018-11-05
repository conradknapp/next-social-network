const mongoose = require("mongoose");
const multer = require("multer");
const jimp = require("jimp");
const User = mongoose.model("User");

// exports.getUsers = async (req, res) => {
//   const users = await User.find().select("name email updatedAt createdAt");
//   res.json(users);
// };

exports.getAuthUser = (req, res) => {
  if (!req.user) {
    return res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up"
    });
  }
  res.json(req.user);
};

exports.getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
  req.profile = user;

  const profileId = mongoose.Types.ObjectId(req.profile._id);

  if (profileId.equals(req.user._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
};

exports.getUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    return res.status(404).json({
      message: "No user found"
    });
  }
  res.json(user);
};

const avatarUploadOptions = {
  storage: multer.memoryStorage(),
  limits: {
    // stores image files up to 1mb
    fileSize: 1024 * 1024 * 1
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith("image/")) {
      next(null, true);
    } else {
      next(null, false);
    }
  }
};

// We have to make sure the type= file with name attribute should be same as the parameter name passed in upload.single()
exports.uploadAvatar = multer(avatarUploadOptions).single("avatar");

exports.resizeAvatar = async (req, res, next) => {
  // multer puts our uploaded image on req.file
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.avatar = `/static/uploads/avatars/${
    req.user.name
  }-${Date.now()}.${extension}`;
  const image = await jimp.read(req.file.buffer);
  await image.resize(250, jimp.AUTO);
  await image.write(`./${req.body.avatar}`);
  next();
};

exports.updateUser = async (req, res) => {
  req.body.updatedAt = new Date().toISOString();
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: req.body },
    // Run Validators is an option that allows us to rerun our Mongoose schema validation (w/ validate, required, min/maxlength)
    { new: true, runValidators: true }
  );
  res.json(updatedUser);
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!req.isAuthUser) {
    return res.status(403).json({
      message: "You are not authorized to perform this action"
    });
  }
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  res.json(deletedUser);
};

exports.addFollowing = async (req, res, next) => {
  const { authUserId, followId } = req.body;

  await User.findOneAndUpdate(
    { _id: authUserId },
    { $push: { following: followId } }
  );
  next();
};

exports.addFollower = async (req, res) => {
  const { authUserId, followId } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: followId },
    { $push: { followers: authUserId } },
    { new: true }
  );
  res.json(user);
};

exports.deleteFollowing = async (req, res, next) => {
  const { authUserId, followId } = req.body;

  await User.findOneAndUpdate(
    { _id: authUserId },
    { $pull: { following: followId } }
  );
  next();
};

exports.deleteFollower = async (req, res) => {
  const { authUserId, followId } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: followId },
    { $pull: { followers: authUserId } },
    { new: true }
  );
  res.json(user);
};

exports.getUserFeed = async (req, res) => {
  const { following, _id } = req.profile;

  following.push(_id);
  const users = await User.find({ _id: { $nin: following } }).select(
    "_id name avatar"
  );
  res.json(users);
};
