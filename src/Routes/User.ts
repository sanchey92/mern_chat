import {Router} from "express";
import UserController from "../Controllers/UserController";
import {check} from 'express-validator';

export default class UserRoutes {
  public router: Router;
  public userController: UserController = new UserController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.post('/signup',
      [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6})
      ],
      this.userController.signup);
    this.router.post('/signin',
      [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 6})
      ],
      this.userController.signin
    )
  }

}