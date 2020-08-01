import {Router} from "express";
import ChatroomController from "../Controllers/ChatroomController";
import {check} from 'express-validator';
import {checkAuth} from "../Middlewares/checkAuth";

const router = Router();
const chatroom = new ChatroomController()

// @ts-ignore
router.use(checkAuth)

router.post('/',
  [
    check('name').not().isEmpty()
  ],
  chatroom.createChatroom);

export default router;