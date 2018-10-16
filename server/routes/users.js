import express from "express";
// import authController from "../controllers/authController";
import userController from "../controllers/userController";

const router = express.Router();

router.route("/").get(userController.getUsers);

router.route("/profile/:userId").get(userController.read);

router
  .route("/follow")
  .put(userController.addFollowing, userController.addFollower);

router
  .route("/unfollow")
  .put(userController.removeFollowing, userController.removeFollower);

router
  .route("/:userId")
  .get(userController.read)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/photo/:userId")
  .get(userController.photo, userController.defaultPhoto);

router.route("/defaultphoto").get(userController.defaultPhoto);

router.param("userId", userController.userByID);

export default router;
