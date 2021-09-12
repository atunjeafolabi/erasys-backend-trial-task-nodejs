import chalk from 'chalk';
import { createConnection } from 'typeorm';
import PasswordChecker from '../src/checker';
import { Password } from '../src/entity/password';

process.env = Object.assign(process.env, {
  PASSWORD_CHECKER_API: 'http://localhost:3000/passwords',
  COMPROMISED_PASSWORD_CHECKER_API: 'http://localhost:5000/compromised',
});

createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test-database',
  entities: ['src/entity/**/*.ts'],
});

describe('password checker', () => {
  it('test that a valid password prints a valid message', async () => {
    // mock api calls

    // mock console.log
    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const validPassword = new Password().setPassword('password1@');
    await passwordChecker.check(validPassword);

    const compromised = '';

    // expectation
    expect(console.log).toHaveBeenCalledWith(
      `${chalk.green('VALID')} ${compromised}: ${
        validPassword.password
      } is valid`
    );
  });

  it('test that a password below five characters is invalid', async () => {
    // mock api calls

    // mock console.log
    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const invalidPassword = new Password().setPassword('pass');
    await passwordChecker.check(invalidPassword);

    const compromised = '';
    const errorMessage =
      'Password must contain at least one upper-case character OR alternatively one special character';

    // expectations
    expect(console.log).toHaveBeenCalledWith(
      `${chalk.red('INVALID')} ${compromised}: ${
        invalidPassword.password
      } (${errorMessage})`
    );
  });

  it('test that a password without at least one digit is invalid', async () => {
    // mock api calls

    // mock console.log
    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const invalidPassword = new Password().setPassword('password');
    await passwordChecker.check(invalidPassword);

    const compromised = '';
    const errorMessage = 'At least one digit must be used in the password';

    // expectations
    expect(console.log).toHaveBeenCalledWith(
      `${chalk.red('INVALID')} ${compromised}: ${
        invalidPassword.password
      } (${errorMessage})`
    );
  });

  it('test that a password without at least one special or alretnatively upper-case character is invalid', async () => {
    // mock api calls

    // mock console.log
    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const invalidPassword = new Password().setPassword('password1');
    await passwordChecker.check(invalidPassword);

    const compromised = '';
    const errorMessage =
      'Password must contain at least one upper-case character OR alternatively one special character';

    // expectations
    expect(console.log).toHaveBeenCalledWith(
      `${chalk.red('INVALID')} ${compromised}: ${
        invalidPassword.password
      } (${errorMessage})`
    );
  });
});
