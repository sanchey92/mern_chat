import express, {Application, json, urlencoded} from 'express';
import {createServer, Server} from 'http';
import SocketIO from "socket.io";
import socket from 'socket.io';
import {connect} from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import UserRoutes from './Routes/User';
import ChatroomRoutes from "./Routes/Chatroom";
import jwt from 'jsonwebtoken';
import User from "./Models/User";
import Message from "./Models/Message";

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
    this.configIO()
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

  private configIO(): void {
    this.io.use(async (socket: any, next) => {
      try {
        const token = socket.handshake.query.token;
        const payload: any = await jwt.verify(token, 'secret');
        socket.userId = payload.id;
        next();
      } catch (err) {}
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log('server started')

      io.on("connection", (socket) => {
        console.log("Connected: " + socket.userId);

        socket.on("disconnect", () => {
          console.log("Disconnected: " + socket.userId);
        });

        socket.on("joinRoom", ({ chatroomId }) => {
          socket.join(chatroomId);
          console.log("A user joined chatroom: " + chatroomId);
        });

        socket.on("leaveRoom", ({ chatroomId }) => {
          socket.leave(chatroomId);
          console.log("A user left chatroom: " + chatroomId);
        });

        socket.on("chatroomMessage", async ({ chatroomId, message }) => {
          if (message.trim().length > 0) {
            const user = await User.findOne({ _id: socket.userId });
            const newMessage = new Message({
              chatroom: chatroomId,
              user: socket.userId,
              message,
            });
            io.to(chatroomId).emit("newMessage", {
              message,
              name: user.name,
              userId: socket.userId,
            });
            await newMessage.save();
          }
    })
  }
}
