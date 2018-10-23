import mongoose from "mongoose";
import passport from "passport";

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
    const json = errors.map(err => err.msg);
    return res.status(400).send(json);
  }
  next();
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await new User({ name, email, password });
  // passport local mongoose plugin gives us a register method that will hash our password and call .save();
  User.register(user, password, (err, user) => {
    if (err) {
      return res.sendStatus(500);
    }
    // console.log("user registered!", user);
    res.json(user.name);
  });
};

export const signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }

    req.logIn(user, err => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(user);
    });
  })(req, res, next);
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
