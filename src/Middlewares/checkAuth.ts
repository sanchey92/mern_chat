import {verify} from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";

export interface Req extends Request {
  payload: any;
}

export const checkConst = async (req: Req, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') next();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authentication failed');
    const decodedToken = verify(token, 'secret');
    next()
    req.payload = decodedToken;
  } catch (e) {
    throw new Error(e);
  }
}