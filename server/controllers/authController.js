// import jwt from "jsonwebtoken";
import User from "../models/User";
require("dotenv").config({ path: "variables.env" });
const dev = process.env.NODE_ENV !== "production";

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

const signinUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      error: "Wrong email and/or password"
    });
    return;
  }
  if (!user.authenticate(password)) {
    return res.status(401).send({
      error: "Email and password do not match"
    });
  }
  const tokenPayload = {
    email: user.email,
    name: user.name,
    type: "authenticated"
  };
  // use httpOnly flag (prevents JavaScript access to cookie)
  // use secure flag (only set cookie for https requests)
  // Signed cookies (verify source of cookie)
  // const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
  const COOKIE_OPTIONS = {
    // domain: 'YOU_DOMAIN',
    path: "/",
    secure: !dev,
    httpOnly: true,
    signed: true
  };
  res.cookie("token", tokenPayload, COOKIE_OPTIONS);
  res.status(200).json(tokenPayload);
};

const signoutUser = (req, res) => {
  // can also optionally pass the TOKEN_OPTIONS variable
  res.clearCookie("token");
  return res.sendStatus(204);
};

const hasAuthorization = (req, res, next) => {
  const isAuth = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!isAuth) {
    return res.status(403).json({
      error: "User not authorized"
    });
  }
  next();
};

export default { signupUser, signinUser, signoutUser, hasAuthorization };
