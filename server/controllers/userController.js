const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.getUsers = async (req, res) => {
  const users = await User.find().select("name email updatedAt createdAt");
  res.json(users);
};

exports.getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
  req.profile = user;
  next();
};

exports.getMe = (req, res) => {
  res.json(req.user);
};

exports.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    return res.status(404).json({
      message: "No user found"
    });
  }
  res.json(user);
};

exports.updateUser = (req, res) => {
  // let form = new formidable.IncomingForm();
  // form.keepExtensions = true;
  // form.parse(req, async (err, fields, files) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: "Photo could not be uploaded"
  //     });
  //   }
  //   let user = req.user;
  //   user = _.extend(user, fields);
  //   user.updatedAt = new Date().toISOString();
  //   if (files.avatar) {
  //     user.avatar.data = fs.readFileSync(files.avatar.path);
  //     user.avatar.contentType = files.avatar.type;
  //   }
  //   const updatedUser = await user.save();
  //   res.json(updatedUser);
  // });
};

exports.deleteUser = async (req, res) => {
  const isAuthUser = req.params.userId === req.user._id;
  if (!isAuthUser) {
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

  const result = await User.findOneAndUpdate(
    { _id: followId },
    { $push: { followers: authUserId } },
    { new: true }
  );
  res.json(result);
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

  const result = await User.findOneAndUpdate(
    { _id: followId },
    { $pull: { followers: authUserId } },
    { new: true }
  );
  res.json(result);
};

exports.getUserFeed = async (req, res) => {
  const { following, _id } = req.profile;

  following.push(_id);
  const users = await User.find({ _id: { $nin: following } }).select(
    "_id name avatar"
  );
  res.json(users);
};
