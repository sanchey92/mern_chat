import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
  name: string,
  email: string,
  password: string
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

export default model<IUser>('User', userSchema);