import {Schema, model, Document} from "mongoose"

export interface IChatroom extends Document {
  name: string;
}

const chatroomSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

export default model<IChatroom>('Chatroom', chatroomSchema);