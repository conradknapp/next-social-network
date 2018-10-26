const mongoose = require("mongoose");
const formidable = require("formidable");
const fs = require("fs");

const Post = mongoose.model("Post");

exports.addPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    let post = await new Post(fields);
    post.postedBy = req.user._id;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    const newPost = await Post.populate(post, {
      path: "postedBy",
      select: "_id name"
    });
    await newPost.save();
    res.json(newPost);
  });
};

exports.getPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id }).populate("postedBy", "_id name");
  console.log({ post });
  req.post = post;
  next();
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.user._id })
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .sort("-created");
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const { following, _id } = req.user;
  following.push(_id);
  const posts = await Post.find({ postedBy: { $in: following } })
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .sort("-created");
  res.json(posts);
};

exports.removePost = async (req, res) => {
  const { _id } = req.post;
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.getPostImage = (req, res) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.toggleLike = async (req, res) => {
  const { userId, postId } = req.body;
  const post = await Post.findOne({ _id: postId })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name");
  const userIds = post.likes.map(id => id.toString());
  if (userIds.includes(userId)) {
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
    const { _id } = comment;
    data = { _id };
    operator = "$pull";
  } else {
    data = comment;
    operator = "$push";
  }
  const newComment = await Post.findOneAndUpdate(
    { _id: postId },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name");
  res.json(newComment);
};
