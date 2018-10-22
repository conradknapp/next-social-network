import mongoose from "mongoose";
import _ from "lodash";
import formidable from "formidable";
import fs from "fs";

const Post = mongoose.model("Post");

export const create = (req, res) => {
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

export const postByID = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post)
        return res.status(400).json({
          error: "Post not found"
        });
      req.post = post;
      next();
    });
};

export const listByUser = (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      res.json(posts);
    });
};

export const listNewsFeed = (req, res) => {
  const { following, _id } = req.user;
  following.push(_id);
  Post.find({ postedBy: { $in: following } })
    .populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .sort("-created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      res.json(posts);
    });
};

export const remove = async (req, res) => {
  const { _id } = req.post;
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

export const photo = (req, res) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

export const toggleLike = async (req, res) => {
  const { userId, postId } = req.body;
  const likedPost = await Post.findOne({ _id: postId })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name");
  const likes = likedPost.likes.map(like => like.toString());
  if (likes.includes(userId)) {
    await likedPost.likes.pull(userId);
  } else {
    await likedPost.likes.push(userId);
  }
  await likedPost.save();
  res.json(likedPost);
};

export const toggleComment = async (req, res) => {
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
