import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';

@Service()
class PasswordCheckerController {
  password(request: Request, response: Response, next: NextFunction) {
    response
      .status(201)
      .json({ message: 'success', data: request.body.password });
  }
}

export default PasswordCheckerController;
