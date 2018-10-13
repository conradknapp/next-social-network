import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import User from "../models/User";
require("dotenv").config({ path: "variables.env" });

const signin = (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err || !user)
        return res.status("401").json({
          error: "User not found"
        });

      if (!user.authenticate(req.body.password)) {
        return res.status("401").send({
          error: "Email and password do not match"
        });
      }

      const token = jwt.sign(
        {
          _id: user._id
        },
        process.env.JWT_SECRET
      );

      res.cookie("t", token, {
        expire: new Date() + 9999
      });

      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
  );
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status("200").json({
    message: "Successfully signed out"
  });
};

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

const hasAuthorization = (req, res, next) => {
  const isAuth = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!isAuth) {
    return res.status("403").json({
      error: "User not authorized"
    });
  }
  next();
};

export default { signin, signout, requireSignin, hasAuthorization };
