const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.validateSignup = (req, res, next) => {
  // Sanitize Form Values
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.sanitizeBody("password");

  // Name is non-null and between 4 and 10 chars
  req.checkBody("name", "Enter a name").notEmpty();
  // req
  //   .checkBody("name", "Name must be between 4 and 10 characters")
  //   .isLength({ min: 4, max: 10 });

  // Email is non-null, valid, and normalized
  req
    .checkBody("email", "Enter a valid email")
    .isEmail()
    .normalizeEmail();

  // Password is non-null
  req.checkBody("password", "Password is required").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map(err => err.msg)[0];
    return res.status(400).send(firstError);
  }
  next();
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await new User({ name, email, password });
  // passport local mongoose plugin gives us a register method that will hash our password and call .save();
  User.register(user, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    // console.log("user registered!", user);
    res.json(user.name);
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }

    req.logIn(user, err => {
      if (err) {
        return res.status(500).json(err.message);
      }
      res.json(user);
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  res.clearCookie("next-connect.sid");
  req.logout();
  res.json({ message: "You are now signed out!" });
};

exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};
