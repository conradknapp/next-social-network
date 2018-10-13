import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';

const router = express.Router();

router.route('/')
  .get(userController.list)
  .post(userController.create)

router.route('/:userId')
  .get(authController.requireSignin, userController.read)
  .put(authController.requireSignin, userController.update)
  .delete(authController.requireSignin, userController.remove)

router.param('userId', userController.userByID)

export default router;