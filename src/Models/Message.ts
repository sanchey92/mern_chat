import {Schema, model, Document} from "mongoose";

export interface IMessage extends Document{
  chatroom: Schema.Types.ObjectId,
  user: Schema.Types.ObjectId,
  message: string
}

const messageSchema = new Schema({
  chatroom: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Chatroom'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  }
})

export default model<IMessage>('Message', messageSchema)