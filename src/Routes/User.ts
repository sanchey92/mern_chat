import {Router} from "express";
import UserController from "../Controllers/UserController";
import {check} from 'express-validator';

const userController = new UserController();
const router = Router();

router.post('/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
  ],
  userController.signup);
router.post('/signin',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
  ],
userController.signin
)

export default router;