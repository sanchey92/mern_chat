import {verify} from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";

export interface Req extends Request {
  payload: any;
}

export const checkAuth = async (req: Req, res: Response, next: NextFunction): Promise<any>  => {
  if (req.method === 'OPTIONS') next();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authentication failed');
    const decodedToken = verify(token, 'secret');
    next();
    req.payload = decodedToken;
  } catch (e) {
    throw new Error(e);
  }
}