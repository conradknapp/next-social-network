import mongoose from "mongoose";
const Post = mongoose.model("Post");
import _ from "lodash";
import formidable from "formidable";
import fs from "fs";

export const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    let post = new Post(fields);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      res.json(result);
    });
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
  Post.find({ postedBy: req.profile._id })
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
  let following = req.profile.following;
  following.push(req.profile._id);
  Post.find({ postedBy: { $in: req.profile.following } })
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

export const remove = (req, res) => {
  let post = req.post;
  post.remove((err, deletedPost) => {
    if (err) {
      return res.status(400).json({
        error: "Error"
      });
    }
    res.json(deletedPost);
  });
};

export const photo = (req, res) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

export const like = async (req, res) => {
  const { userId, post } = req.body;
  const likedPost = await Post.findOne({ _id: post._id });
  const likes = likedPost.likes.map(like => like.toString());
  if (likes.includes(userId)) {
    await likedPost.likes.pull(userId);
  } else {
    await likedPost.likes.push(userId);
  }
  await likedPost.save();
  res.json(likedPost);

  // const { userId, post } = req.body;
  // const likedPost = await Post.findOne({ _id: post._id });
  // const operator = likes.includes(userId) ? "$pull" : "$addToSet";
  // const result = await Post.findOneAndUpdate(
  //   { _id: likedPost._id },
  //   { [operator]: { likes: userId } },
  //   { new: true }
  // );
  // res.json(result);
};

export const unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Error"
      });
    }
    res.json(result);
  });
};

export const comment = (req, res) => {
  const { comment, postId } = req.body;
  Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      res.json(result);
    });
};

export const uncomment = (req, res) => {
  const { comment, postId } = req.body;
  Post.findByIdAndUpdate(
    postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Error"
        });
      }
      res.json(result);
    });
};
