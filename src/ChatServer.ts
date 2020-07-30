import express, {Application, json, urlencoded} from 'express';
import {connect} from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export default class ChatServer {

  private readonly app: Application;
  private readonly MONGO_URI: string;
  private readonly port: any;

  constructor() {
    this.port = process.env.PORT || 8000;
    this.MONGO_URI = process.env.MONGO_URI!;
    this.app = express();
    this.config();
    this.connectDB().then(() => console.log('connected to db'));
  }

  private config(): void {
    this.app.use(json());
    this.app.use(urlencoded({extended: true}));
    this.app.use(cors());
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
      console.log(`server started! on http://localhost:${this.port}`)
    })
  }

}
