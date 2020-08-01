import {Router} from "express";
import UserController from "../Controllers/UserController";

const userController = new UserController();
const router = Router();

router.post('/signup', userController.signup);
router.post('/signin', userController.signin)

export default router;