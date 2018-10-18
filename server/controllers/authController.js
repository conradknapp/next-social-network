import mongoose from "mongoose";
import passport from "passport";

const User = mongoose.model("User");

export const validateSignup = (req, res, next) => {
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    console.log(errors.map(err => err.msg));
    return;
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
    res.status(200).json({
      message: "Sign up successful!"
    });
  });
};

export const signin = passport.authenticate("local", {
  failureRedirect: "/login",
  // failureFlash: "Failed Login!",
  successRedirect: "/"
  // successFlash: "You are now logged in!"
});

// export const signin = (req, res) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       // Authentication failed - Error 500 - Server Error
//       // return next(err);
//       console.log(err);
//     }
//     if (!user) {
//       // Authentication failed - Error 401 Missing Credentials
//       console.log("ayy", info);
//       return res.status(401).json(info);
//     }
//     res.status(200).json(user);
//     // return res.redirect("/");
//   })(req, res);
// };

export const signout = (req, res) => {
  // res.clearCookie("next-social.sid");
  req.logout();
  res.json({ message: "You are now signed out!" });
  // res.redirect("/");
};

export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};
