import 'reflect-metadata';
import figlet from 'figlet';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import PasswordChecker from '../checker';
import { Password } from '../entity/password';
import chalk, { Color } from 'chalk';

class App {
  constructor() {
    this.setup();
  }

  private setup() {
    dotenv.config();
    this.printHeader();
  }

  private printHeader() {
    console.log(
      figlet.textSync('Password Checker', {
        horizontalLayout: 'default',
      })
    );

    console.log(`
---------------------------------------------------------------
✓ Checks if a password is valid according to pre-defined rules.
✓ Checks if a password has been compromised.
---------------------------------------------------------------
      `);
  }

  async passwordCheck(shouldUpdateValidField: boolean) {
    await createConnection();
    const passwordChecker = new PasswordChecker();

    const passwords = await Password.find();
    passwords.forEach(async (password: Password) => {
      await passwordChecker.check(password);

      if (password.isValid()) {
        this.printOutput(password, '');
      } else {
        Object.values(password.getErrorMessages()).forEach((errorMessage) => {
          this.printOutput(password, errorMessage);
        });
      }

      if (shouldUpdateValidField) {
        password.save();
      }
    });
  }

  private printOutput(password: Password, errorMessage: string = '') {
    let compromised = '';
    if (password.isCompromised()) {
      compromised = chalk.yellow('(COMPROMISED)');
    }

    let status = `${chalk.green('VALID')}`;
    if (!password.isValid()) {
      status = `${chalk.red('INVALID')}`;
      errorMessage = `(${errorMessage})`;
    }

    console.log(
      `${status} ${compromised}: ${password.getValue()} ${errorMessage}`
    );
  }
}

export default App;
