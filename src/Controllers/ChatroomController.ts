import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import Chatroom, {IChatroom} from "../Models/Chatroom";

export default class ChatroomController {

  public async createChatroom(req: Request, res: Response): Promise<any> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) throw new Error('Invalid data');

    const {name} = req.body;
    let existingChatroom: IChatroom | null;

    try {
      existingChatroom = await Chatroom.findOne({name: name});
    } catch (e) {
      console.log(e)
    }

    if (existingChatroom!) throw new Error('this room name is already used');

    const createdRoom = new Chatroom({name});

    try {
      await createdRoom.save();
    } catch (e) {
      console.log(e)
    }

    res.status(200).json({message: 'chatroom created!'});
  }
}