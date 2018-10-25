import express from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";
import * as postController from "../controllers/postController";

const router = express.Router();

/* Auth Routes */
router.post(
  "/api/auth/signup",
  authController.validateSignup,
  authController.signup
);
// router.post("/api/auth/signin", passport.authenticate("local"), (req, res) => {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   res.json(req.user);
// });
router.post("/api/auth/signin", authController.signin);
router.get("/api/auth/signout", authController.signout);

/* User Routes */
router.get("/api/users", userController.getUsers);
router.get("/api/users/profile/:userId", userController.getUser);

router.put(
  "/api/users/follow",
  authController.checkAuth,
  userController.addFollowing,
  userController.addFollower
);
router.put(
  "/api/users/unfollow",
  authController.checkAuth,
  userController.removeFollowing,
  userController.removeFollower
);

router.get("/api/users/findusers/:userId", userController.findUsers);
router
  .route("/api/users/:userId")
  .get(userController.getMe)
  .put(authController.checkAuth, userController.updateUser)
  .delete(authController.checkAuth, userController.deleteUser);

router.get(
  "/api/users/image/:userId",
  userController.getImage,
  userController.getDefaultImage
);
router.get("/api/users/defaultimage", userController.getDefaultImage);

/* Post Routes */
router.put(
  "/api/posts/like",
  authController.checkAuth,
  postController.toggleLike
);
router.put(
  "/api/posts/unlike",
  authController.checkAuth,
  postController.toggleLike
);

router.put(
  "/api/posts/comment",
  authController.checkAuth,
  postController.toggleComment
);
router.put(
  "/api/posts/uncomment",
  authController.checkAuth,
  postController.toggleComment
);

router.delete(
  "/api/posts/:postId",
  authController.checkAuth,
  postController.removePost
);

router.post(
  "/api/posts/new/:userId",
  authController.checkAuth,
  postController.addPost
);
router.get("/api/posts/image/:postId", postController.getPostImage);
router.get("/api/posts/by/:userId", postController.getPostsByUser);
router.get("/api/posts/feed/:userId", postController.getPostFeed);

router.param("userId", userController.getUserById);
router.param("postId", postController.getPostById);

/* Catches errors for async/await functions */
const catchErrors = func => {
  return function(req, res, next) {
    return func(req, res, next).catch(next);
  };
};

export default router;
