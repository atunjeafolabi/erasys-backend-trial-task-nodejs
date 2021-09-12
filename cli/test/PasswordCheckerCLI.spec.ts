import chalk from 'chalk';
import { createConnection } from 'typeorm';
import PasswordChecker from '../src/checker';
import { Password } from '../src/entity/password';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';

process.env = Object.assign(process.env, {
  PASSWORD_CHECKER_API: 'http://localhost:3000/passwords',
  COMPROMISED_PASSWORD_CHECKER_API: 'http://localhost:5000/compromised',
  NODE_ENV: 'test',
});

describe('password checker test', () => {
  beforeAll(async () => {
    await createConnection();
  });

  it('a valid password prints a valid message', async () => {
    const validPassword = 'password1@';
    // mock api calls
    mockApiEndpoints(
      validPassword,
      '',
      StatusCodes.NO_CONTENT,
      StatusCodes.NO_CONTENT
    );
    const compromised = '';

    // mock console.log
    console.log = jest.fn();

    // initiate an action
    const passwordChecker = new PasswordChecker();
    const password = new Password().setPassword(validPassword);
    await passwordChecker.check(password);

    // expectation
    expect(console.log).toHaveBeenCalledWith(
      `${chalk.green('VALID')} ${compromised}: ${password.password} is valid`
    );
  });

  it('a password below five characters is prints an invalid message', async () => {
    const invalidPassword = 'pas1@';
    const compromised = '';
    const errorMessage = 'Password length must be minimum 5 characters';

    mockApiEndpoints(
      invalidPassword,
      errorMessage,
      StatusCodes.BAD_REQUEST,
      StatusCodes.NO_CONTENT
    );

    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const password = new Password().setPassword(invalidPassword);
    await passwordChecker.check(password);

    expect(console.log).toHaveBeenCalledWith(
      `${chalk.red('INVALID')} ${compromised}: ${
        password.password
      } (${errorMessage})`
    );
  });

  it('a password without at least one digit prints an invalid message', async () => {
    const invalidPassword = 'password@';
    const compromised = '';
    const errorMessage = 'At least one digit must be used in the password';

    mockApiEndpoints(
      invalidPassword,
      errorMessage,
      StatusCodes.BAD_REQUEST,
      StatusCodes.NO_CONTENT
    );

    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const password = new Password().setPassword(invalidPassword);
    await passwordChecker.check(password);

    expect(console.log).toHaveBeenCalledWith(
      `${chalk.red('INVALID')} ${compromised}: ${
        password.password
      } (${errorMessage})`
    );
  });

  it('a password without at least one special or alretnatively upper-case character prints an invalid message', async () => {
    const invalidPassword = 'password1';
    const compromised = '';
    const errorMessage =
      'Password must contain at least one upper-case character OR alternatively one special character';

    mockApiEndpoints(
      invalidPassword,
      errorMessage,
      StatusCodes.BAD_REQUEST,
      StatusCodes.NO_CONTENT
    );

    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const password = new Password().setPassword(invalidPassword);
    await passwordChecker.check(password);

    expect(console.log).toHaveBeenCalledWith(
      `${chalk.red('INVALID')} ${compromised}: ${
        password.password
      } (${errorMessage})`
    );
  });

  it('a valid and compromised password prints a corresponding message', async () => {
    const validPassword = 'password1@';

    mockApiEndpoints(validPassword, '', StatusCodes.NO_CONTENT, StatusCodes.OK);
    const compromised = chalk.yellow('(COMPROMISED)');

    console.log = jest.fn();

    const passwordChecker = new PasswordChecker();
    const password = new Password().setPassword(validPassword);
    await passwordChecker.check(password);

    expect(console.log).toHaveBeenCalledWith(
      `${chalk.green('VALID')} ${compromised}: ${password.password} is valid`
    );
  });
});

function mockApiEndpoints(
  password: string,
  message: string = '',
  postResponseCode: number,
  getResponseCode: number
) {
  let passwordCheckerResponseMessage = {};
  if (message !== '') {
    passwordCheckerResponseMessage = {
      errors: [message],
    };
  }

  const mock = new MockAdapter(axios);

  mock
    .onPost(`${process.env.PASSWORD_CHECKER_API}`, { password })
    .reply(postResponseCode, passwordCheckerResponseMessage);

  mock
    .onGet(`${process.env.COMPROMISED_PASSWORD_CHECKER_API}`, {
      params: { password },
    })
    .reply(getResponseCode);
}
