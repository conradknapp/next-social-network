const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

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
  userController.deleteFollowing,
  userController.deleteFollower
);

router.get("/api/users/findusers/:userId", userController.findUsers);
router
  .route("/api/users/:userId")
  .get(userController.getMe)
  .put(authController.checkAuth, userController.updateUser)
  .delete(authController.checkAuth, userController.deleteUser);

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
  postController.deletePost
);

router.post(
  "/api/posts/new/:userId",
  authController.checkAuth,
  postController.uploadImage,
  postController.resizeImage,
  postController.addPost
);
// router.get("/api/posts/image/:postId", postController.getPostImage);
router.get("/api/posts/by/:userId", postController.getPostsByUser);
router.get("/api/posts/feed/:userId", postController.getPostFeed);

router.param("userId", userController.getUserById);
router.param("postId", postController.getPostById);

module.exports = router;
