import chalk from 'chalk';
import { createConnection } from 'typeorm';
import PasswordChecker from '../src/checker';
import { Password } from '../src/entity/password';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import App from '../src/bootstrap/app';

process.env = Object.assign(process.env, {
  PASSWORD_CHECKER_API: 'http://localhost:3000/passwords',
  COMPROMISED_PASSWORD_CHECKER_API: 'http://localhost:5000/compromised',
  NODE_ENV: 'test',
});

describe('password checker test', () => {
  const IS_VALID = 1;
  const NOT_VALID = 0;

  it('a 204 response sets a password as valid', async () => {
    /**
     * mock api calls for valid and uncompromised
     * password by forcing 204 response code in
     * both cases
     */
    mockApiEndpoints([], StatusCodes.NO_CONTENT, StatusCodes.NO_CONTENT);

    const password = new Password();
    password.setValue('dummy-password');

    // initiate an action
    const passwordChecker = new PasswordChecker();
    await passwordChecker.check(password);

    // expectation
    expect(password.isValid()).toEqual(IS_VALID);
  });

  it('an invalid password sets password errors', async () => {
    const errorMessage = ['Password length must be minimum 5 characters'];
    mockApiEndpoints(
      errorMessage,
      StatusCodes.BAD_REQUEST,
      StatusCodes.NO_CONTENT
    );

    const password = new Password();
    password.setValue('dummy-password');
    const passwordChecker = new PasswordChecker();
    await passwordChecker.check(password);

    expect(password.isValid()).toBe(NOT_VALID);
    expect(password.getErrorMessages()).toEqual(errorMessage);
  });

  it('a 200 response from the compromised API sets the compromised field of password to true', async () => {
    /**
     * mock api calls for valid and compromised
     * password by forcing 204 and 200 response code
     */
    mockApiEndpoints([], StatusCodes.NO_CONTENT, StatusCodes.OK);

    const password = new Password();
    password.setValue('dummy-password');
    const passwordChecker = new PasswordChecker();
    await passwordChecker.check(password);

    expect(password.isCompromised()).toBe(true);
  });
});

function mockApiEndpoints(
  message: string[] = [],
  passwordCheckerResponseCode: number,
  compromisedPasswordCheckerResponseCode: number
) {
  const dummyPassword = 'dummy-password';
  let passwordCheckerResponseMessage = {};

  if (message !== []) {
    passwordCheckerResponseMessage = {
      errors: message,
    };
  }

  const mock = new MockAdapter(axios);

  mock
    .onPost(`${process.env.PASSWORD_CHECKER_API}`, { password: dummyPassword })
    .reply(passwordCheckerResponseCode, passwordCheckerResponseMessage);

  mock
    .onGet(`${process.env.COMPROMISED_PASSWORD_CHECKER_API}`, {
      params: { password: dummyPassword },
    })
    .reply(compromisedPasswordCheckerResponseCode);
}
