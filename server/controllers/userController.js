import User from "../models/User";

const create = (req, res) => {
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message || err.toString() });
    }
    res.status(200).json({
      message: "Sign up successful!"
    });
  });
};

const list = (_, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({ error: err.message || err.toString() });
    }
    res.json(users);
  }).select("name email updated created");
};

const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status("400").json({
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
  return res.json(req.profile);
};

const update = (req, res) => {
  let user = req.profile;
  user = { ...user, ...req.body };
  user.updated = Date.now();
  user.save(err => {
    if (err) {
      return res.status(400).json({ error: err.message || err.toString() });
    }
    user.hashed_password = null;
    user.salt = null;
    res.json(user);
  });
};

const remove = (req, res) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({ error: err.message || err.toString() });
    }
    // deletedUser.hashed_password = null;
    // deletedUser.salt = null;
    res.json(deletedUser);
  });
};

export default { create, list, userByID, read, update, remove };
