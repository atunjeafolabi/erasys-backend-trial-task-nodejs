import { Request, Response, NextFunction } from 'express';
import { Container, Service } from 'typedi';
import PasswordValidator from '../validators/PasswordValidator';
import { StatusCodes } from 'http-status-codes';
import Password from '../password/Password';

@Service()
class PasswordCheckerController {
  constructor(private passwordValidator: PasswordValidator) {}

  password(request: Request, response: Response, next: NextFunction) {
    // receive the password from request
    let password = new Password(request.body.password);

    this.passwordValidator.validate(password);

    if (password.isValid()) {
      return response.status(StatusCodes.NO_CONTENT).json({});
    }

    return response
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: password.getErrors() });
  }
}

export default PasswordCheckerController;
