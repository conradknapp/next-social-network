import User from "../models/User";

const signupUser = async (req, res) => {
  const user = await new User(req.body).save();
  if (!user) {
    res.status(400).json({
      error: "Please provide email and/or password"
    });
    return;
  }
  res.status(200).json({
    message: "Sign up successful!"
  });
};
// const create = (req, res) => {
//   const user = new User(req.body);
//   user.save((err, result) => {
//     if (err) {
//       return res.status(400).json({ error: err.message || err.toString() });
//     }
//     res.status(200).json({
//       message: "Sign up successful!"
//     });
//   });
// };

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
  console.log(token);
  if (token && token.email) {
    const user = await User.findOne({ email: token.email }).select(
      "_id name email about created"
    );
    if (!user) {
      res.sendStatus(403);
      return;
    }
    res.status(200).json(user);
    return;
  }
   res.sendStatus(404);
};

const updateUser = (req, res) => {
  let user = req.profile;
  user = { ...user, ...req.body };
  user.updated = Date.now();
  user.save(err => {
    if (err) {
      return res.status(400).json({ error: err.message || err.toString() });
    }
    user.hashed_password = null;
    user.salt = null;
    res.status(200).json(user);
  });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  if (!deletedUser) {
    return res.status(400).json({ error: 'User could not be deleted' });
  }
  res.status(200).json(deletedUser);
}

// const deleteUser = (req, res) => {
//   let user = req.profile;
//   user.remove((err, deletedUser) => {
//     if (err) {
//       return res.status(400).json({ error: err.message || err.toString() });
//     f }
//     // deletedUser.hashed_password = null;
//     // deletedUser.salt = null;
//     res.status(200).json(deletedUser);
//   });
// };

export default { list, userByID, getUserProfile, read, updateUser, deleteUser };
