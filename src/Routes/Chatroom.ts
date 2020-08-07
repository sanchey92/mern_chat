import {Router} from "express";
import ChatroomController from "../Controllers/ChatroomController";
import {check} from 'express-validator';
import {checkAuth} from "../Middlewares/checkAuth";

export default class ChatroomRoutes {
  public router: Router;
  public chatroomController: ChatroomController = new ChatroomController();

  constructor() {
    this.router = Router();
    this.privateConfig();
    this.routes();
  }

  private privateConfig(): void {
    // @ts-ignore
    this.router.use(checkAuth);
  }

  private routes(): void {
    this.router.get('/', this.chatroomController.getChatrooms);
    this.router.post('/',
      [check('name').not().isEmpty()],
      this.chatroomController.createChatroom);
  }
}