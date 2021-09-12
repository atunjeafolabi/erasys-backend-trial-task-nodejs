import { createConnection } from 'typeorm';
import { Password } from '../entity/password';
import axios from 'axios';
import chalk from 'chalk';
import { StatusCodes } from 'http-status-codes';

class PasswordChecker {
  private IS_VALID = 1;
  private NOT_VALID = 0;

  async check(password: Password) {
    const passwordCheckerApi = process.env.PASSWORD_CHECKER_API;
    const isCompromised = await this.isCompromised(password.password);
    let compromised: string = '';
    if (isCompromised) {
      compromised = chalk.yellow('(COMPROMISED)');
    }

    try {
      const response = await axios.post(`${passwordCheckerApi}`, {
        password: password.password,
      });

      if (response.status === StatusCodes.NO_CONTENT) {
        password.valid = this.IS_VALID;
        password.save();
        console.log(
          `${chalk.green('VALID')} ${compromised}: ${
            password.password
          } is valid`
        );
      }
    } catch (error: any) {
      if (error.response.status === StatusCodes.BAD_REQUEST) {
        password.valid = this.NOT_VALID;
        password.save();
        const errorMessages = error.response.data.errors;

        Object.values(errorMessages).forEach((errorMessage) => {
          console.log(
            `${chalk.red('INVALID')} ${compromised}: ${
              password.password
            } (${errorMessage})`
          );
        });
      }
    }
  }

  private async isCompromised(password: string) {
    const compromisedPasswordCheckerApi =
      process.env.COMPROMISED_PASSWORD_CHECKER_API;

    const response = await axios.get(`${compromisedPasswordCheckerApi}`, {
      params: { password },
    });

    return response.status === StatusCodes.OK;
  }
}

export default PasswordChecker;
