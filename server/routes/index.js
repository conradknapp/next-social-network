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
router.get("/api/users/profile/:userId", userController.read);

router.put(
  "/api/users/follow",
  authController.isAuth,
  userController.addFollowing,
  userController.addFollower
);
router.put(
  "/api/users/unfollow",
  authController.isAuth,
  userController.removeFollowing,
  userController.removeFollower
);

router.get("/api/users/findpeople/:userId", userController.findPeople);
router
  .route("/api/users/:userId")
  .get(userController.read)
  .put(authController.isAuth, userController.updateUser)
  .delete(authController.isAuth, userController.deleteUser);

router.get(
  "/api/users/photo/:userId",
  userController.photo,
  userController.defaultPhoto
);
router.get("/api/users/defaultphoto", userController.defaultPhoto);

/* Post Routes */
router.put("/api/posts/like", authController.isAuth, postController.toggleLike);
router.put(
  "/api/posts/unlike",
  authController.isAuth,
  postController.toggleLike
);

router.put(
  "/api/posts/comment",
  authController.isAuth,
  postController.toggleComment
);
router.put(
  "/api/posts/uncomment",
  authController.isAuth,
  postController.toggleComment
);

router.delete(
  "/api/posts/:postId",
  authController.isAuth,
  postController.remove
);

router.post(
  "/api/posts/new/:userId",
  authController.isAuth,
  postController.create
);
router.get("/api/posts/photo/:postId", postController.photo);
router.get("/api/posts/by/:userId", postController.listByUser);
router.get("/api/posts/feed/:userId", postController.listPostFeed);

// router.param("userId", userController.userByID);
router.param("postId", postController.postById);

/* Catches errors for async/await functions */
const catchErrors = func => {
  return function(req, res, next) {
    return func(req, res, next).catch(next);
  };
};

export default router;
