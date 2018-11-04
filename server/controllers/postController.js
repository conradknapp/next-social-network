const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const multer = require("multer");
const jimp = require("jimp");

const imageUploadOptions = {
  storage: multer.memoryStorage(),
  limits: {
    // stores files only up to 1mb
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

exports.uploadImage = multer(imageUploadOptions).single("image");

exports.resizeImage = async (req, res, next) => {
  // multer puts our uploadedImage on req.file
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.image = `/static/uploads/${Date.now()}-${
    req.user.name
  }.${extension}`;
  const image = await jimp.read(req.file.buffer);
  await image.resize(750, jimp.AUTO);
  await image.write(`./${req.body.image}`);
  next();
};

exports.addPost = async (req, res) => {
  req.body.postedBy = req.user._id;
  const post = await new Post(req.body).save();
  await Post.populate("postedBy", "_id name avatar");
  res.json(post);
};

// Note about populating after save: methods like find, findOne returns a Mongoose Object which has all the functions available like Model but .save() returns a plain Javascript object

exports.getPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id });
  req.post = post;
  next();
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.user._id }).sort({
    createdAt: "desc"
  });
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const { following, _id } = req.user;

  following.push(_id);
  const posts = await Post.find({ postedBy: { $in: following } }).sort({
    createdAt: "desc"
  });
  res.json(posts);
};

exports.deletePost = async (req, res) => {
  const deletedPost = await Post.findOneAndDelete({ _id: req.post._id });
  res.json(deletedPost);
};

exports.toggleLike = async (req, res) => {
  const { userId, postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  console.log(post);
  const likeIds = post.likes.map(id => id.toString());
  if (likeIds.includes(userId)) {
    await post.likes.pull(userId);
  } else {
    await post.likes.push(userId);
  }
  await post.save();
  res.json(post);
};

exports.toggleComment = async (req, res) => {
  const { comment, postId } = req.body;
  let operator;
  let data;

  if (req.url.includes("uncomment")) {
    data = { _id: comment._id };
    operator = "$pull";
  } else {
    data = comment;
    operator = "$push";
  }
  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate("postedBy", "_id name avatar")
    .populate("comments.postedBy", "_id name avatar");
  console.log(updatedPost);
  res.json(updatedPost);
};
