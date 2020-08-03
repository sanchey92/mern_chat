import express, {Application, json, urlencoded} from 'express';
import {createServer, Server} from 'http';
import SocketIO from "socket.io";
import socket from 'socket.io';
import {connect} from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import UserRoutes from './Routes/User';
import ChatroomRoutes from "./Routes/Chatroom";

dotenv.config();

export default class ChatServer {

  private readonly MONGO_URI =  process.env.MONGO_URI!;
  private readonly port = process.env.PORT || 8000;
  private readonly userRouter = new UserRoutes().router;
  private readonly chatroomRouter = new ChatroomRoutes().router;
  private readonly app: Application;
  private readonly server: Server;
  private io: SocketIO.Server

  constructor() {
    this.app = express();
    this.server = createServer(this.app)
    this.io = socket(this.server);
    this.connectDB().then(() => console.log('connected to db'));
    this.configApp();
    this.routes();
  }

  private configApp(): void {
    this.app.use(json());
    this.app.use(urlencoded({extended: true}));
    this.app.use(cors());
  }

  private routes(): void {
    this.app.use('/user', this.userRouter);
    this.app.use('/chatroom', this.chatroomRouter);
  }

  private async connectDB(): Promise<any> {
    try {
      await connect(this.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
    } catch (e) {
      console.log(e)
    }
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log('server started')
    })
  }
}
