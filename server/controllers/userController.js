import User from "../models/User";
import formidable from "formidable";
import fs from "fs";
import _ from "lodash";
import profileImage from "../../static/profile-image.jpg";

const list = (_, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({ error: err.message || err.toString() });
    }
    res.status(200).json(users);
  }).select("name email updated created");
};

const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
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
  const { signedCookies = {} } = req;
  const { token = "" } = signedCookies;
  if (token && token.email) {
    const user = await User.findOne({ email: token.email }).select(
      "_id name email about created photo"
    );
    if (!user) {
      return res.sendStatus(403);
    }
    return res.status(200).json(user);
  }
  res.sendStatus(404);
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

export default {
  list,
  userByID,
  getUserProfile,
  read,
  updateUser,
  deleteUser,
  photo,
  defaultPhoto
};
