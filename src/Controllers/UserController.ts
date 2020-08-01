import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {hash, compare} from "bcryptjs";
import jwt, {Secret} from 'jsonwebtoken';
import User, {IUser} from "../Models/User";

export default class UserController {

  public async signup(req: Request, res: Response): Promise<any> {

    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('invalid data');

    const {name, email, password} = req.body;
    let existingUser: IUser | null;
    let hashedPassword;

    try {
      existingUser = await User.findOne({email: email})
    } catch (e) {
      console.log(e)
    }
    if (existingUser!) throw new Error('Signup failed, please try again');

    try {
      hashedPassword = await hash(password, 12);
    } catch (e) {
      console.log(e)
    }

    const createdUser = new User({name, email, password: hashedPassword});

    try {
      await createdUser.save();
    } catch (e) {
      console.log(e);
    }

    res.status(200).json({message: 'user created!'});
  }

  public async signin(req: Request, res: Response): Promise<any> {

    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new Error('invalid data');

    const {email, password} = req.body;
    let existingUser: IUser | null;
    let isValidPassword: boolean;
    let token: Secret;

    try {
      existingUser = await User.findOne({email: email})
    } catch (e) {
      console.log(e)
    }

    if (!existingUser!) throw new Error('User not found, please try again');

    try {
      isValidPassword = await compare(password, existingUser!.password);
    } catch (e) {
      console.log(e)
    }

    if (!isValidPassword!) throw new Error('invalid password, please try again');

    try {
      token = jwt.sign(
        {userId: existingUser!.id, email: existingUser!.email},
        'secret',
        {expiresIn: '1h'}
      );
    } catch (e) {
      console.log(e)
    }

    res.status(200).json({userId: existingUser!.id, name: existingUser!.name, token: token!});
  }
}
