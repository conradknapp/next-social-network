import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.route("/signup").post(authController.signupUser);
router.route("/signin").post(authController.signinUser);
router.route("/signout").get(authController.signoutUser);

export default router;
