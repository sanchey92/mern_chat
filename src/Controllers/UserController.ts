import {Request, Response} from 'express'

export default class UserController {

  public async signup(req: Request, res: Response): Promise<any> {
    const {name, email, password} = req.body;
    
  }

  public signin(req: Request, res: Response): void {
    const {email, password} = req.body;
  }
}
