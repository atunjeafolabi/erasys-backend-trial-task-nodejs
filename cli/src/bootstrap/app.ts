import 'reflect-metadata';
import figlet from 'figlet';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import PasswordChecker from '../checker';
import { Password } from '../entity/password';

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

    passwords.forEach((password: Password) => {
      passwordChecker.check(password, shouldUpdateValidField);
    });
  }
}

export default App;
