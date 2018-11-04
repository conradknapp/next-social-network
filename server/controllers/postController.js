const formidable = require("formidable");
const fs = require("fs");
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

exports.addPost = (req, res) => {
  // await new Post();
  // let form = new formidable.IncomingForm();
  // form.keepExtensions = true;
  // form.parse(req, async (err, fields, files) => {
  //   if (err) {
  //     return res.status(400).json({
  //       error: "Image failed to upload"
  //     });
  //   }
  //   let post = await new Post(fields);
  //   post.postedBy = req.user._id;
  //   if (files.image) {
  //     post.image.data = fs.readFileSync(files.image.path);
  //     post.image.contentType = files.image.type;
  //   }
  // });
  // const newPost = await Post.populate(post, {
  //   path: "postedBy",
  //   select: "_id name image"
  // });
  // await newPost.save();
  // res.json(newPost);
};

exports.getPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id }).populate("postedBy", "_id name");
  req.post = post;
  next();
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.user._id })
    .populate("comments", "text createdAt")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .sort({ createdAt: "desc" });
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const { following, _id } = req.user;

  following.push(_id);
  const posts = await Post.find({ postedBy: { $in: following } })
    .populate({
      path: "comments.postedBy",
      select: "_id name"
    })
    // .populate("comments", "text createdAt")
    // .populate("comments.postedBy", "_id name")
    // .populate("postedBy", "_id name")
    .sort({ createdAt: "desc" });
  console.log(posts);
  res.json(posts);
};

exports.deletePost = async (req, res) => {
  const deletedPost = await Post.findOneAndDelete({ _id: req.post._id });
  res.json(deletedPost);
};

// exports.getPostImage = (req, res) => {
//   res.set("Content-Type", req.post.image.contentType);
//   return res.send(req.post.image.data);
// };

exports.toggleLike = async (req, res) => {
  const { userId, postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  // .populate("comments.postedBy", "_id name")
  // .populate("postedBy", "_id name");
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
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name");
  res.json(updatedPost);
};
