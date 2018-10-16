import express from "express";
import userController from "../controllers/userController";
// import authController from "../controllers/authController";
import postController from "../controllers/postController";

const router = express.Router();

router.route("/like").put(postController.like);
router.route("/unlike").put(postController.unlike);

router.route("/comment").put(postController.comment);
router.route("/uncomment").put(postController.uncomment);

router.route("/:postId").delete(postController.isPoster, postController.remove);

router.route("/new/:userId").post(postController.create);

router.route("/photo/:postId").get(postController.photo);

router.route("/by/:userId").get(postController.listByUser);

router.route("/feed/:userId").get(postController.listNewsFeed);

router.param("userId", userController.userByID);
router.param("postId", postController.postByID);

export default router;
