import express from "express";
// import authController from "../controllers/authController";
import userController from "../controllers/userController";

const router = express.Router();

router.route("/").get(userController.list);

router.route("/profile").get(userController.getUserProfile);

router
  .route("/:userId")
  .get(userController.read)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/photo/:userId')
  .get(userController.photo, userController.defaultPhoto)
  .get(userController.defaultPhoto);

router.param("userId", userController.userByID);

export default router;
