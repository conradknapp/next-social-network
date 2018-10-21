import mongoose from "mongoose";

const User = mongoose.model("User");

export const validateSignup = (req, res, next) => {
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.checkBody("name", "Name is required").notEmpty();
  req
    .checkBody("name", "Name must be between 4 and 10 characters")
    .isLength({ min: 4, max: 10 });
  req
    .checkBody("email", "Email is not valid")
    .isEmail()
    .normalizeEmail();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password", "Password must be between 4 and 10 characters")
    .isLength({ min: 4, max: 10 });
  const errors = req.validationErrors();
  if (errors) {
    const json = JSON.stringify(errors.map(err => err.msg));
    return res.status(400).json(json);
  }
  next();
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await new User({ name, email, password });
  // passport local mongoose plugin gives us a register method that will hash our password and call .save();
  User.register(user, password, (err, account) => {
    if (err) {
      return res.status(400).json({
        error: "Please provide email and/or password"
      });
    }
    console.log("user registered!", account);
    res.status(200).json(account.name);
  });
};

export const signout = (req, res) => {
  res.clearCookie("next-social.sid");
  req.logout();
  res.json({ message: "You are now signed out!" });
};

export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};
