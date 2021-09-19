import { Password } from '../entity/password';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

class PasswordChecker {
  private IS_VALID = 1;
  private NOT_VALID = 0;

  async check(password: Password) {
    const passwordCheckerApi = process.env.PASSWORD_CHECKER_API;

    try {
      const response = await axios.post(`${passwordCheckerApi}`, {
        password: password.getValue(),
      });

      if (response.status === StatusCodes.NO_CONTENT) {
        password.setValid(this.IS_VALID);
      }
    } catch (error: any) {
      if (error.response.status === StatusCodes.BAD_REQUEST) {
        password.setValid(this.NOT_VALID);
        const errorMessages = error.response.data.errors;
        password.setErrorMessages(errorMessages);
      }
    }

    await this.checkCompromised(password);
  }

  private async checkCompromised(password: Password) {
    const compromisedPasswordCheckerApi =
      process.env.COMPROMISED_PASSWORD_CHECKER_API;

    const response = await axios.get(`${compromisedPasswordCheckerApi}`, {
      params: { password: password.getValue() },
    });

    if (response.status === StatusCodes.OK) {
      password.setCompromised(true);
    }
  }
}

export default PasswordChecker;
