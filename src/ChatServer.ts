import express, {Application, json, urlencoded} from 'express';
import {createServer, Server} from 'http';
import SocketIO from "socket.io";
import socket from 'socket.io';
import {connect} from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './Routes/User';

dotenv.config();

export default class ChatServer {

  private readonly server: Server;
  private readonly app: Application;
  private io: SocketIO.Server
  private readonly MONGO_URI: string;
  private readonly port: any;
  private readonly userRoute: any

  constructor() {
    this.port = process.env.PORT || 8000;
    this.MONGO_URI = process.env.MONGO_URI!;
    this.userRoute = userRoutes;
    this.app = express();
    this.server = createServer(this.app)
    this.io = socket(this.server);
    this.connectDB().then(() => console.log('connected to db'));
    this.configApp();
  }

  private configApp(): void {
    this.app.use(json());
    this.app.use(urlencoded({extended: true}));
    this.app.use(cors());
    this.app.use('/user', userRoutes);
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
