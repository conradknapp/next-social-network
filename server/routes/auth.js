import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.route("/signin").post(authController.signin);
router.route("/signout").get(authController.signout);

export default router;
