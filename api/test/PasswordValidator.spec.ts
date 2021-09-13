import 'reflect-metadata';
import Container from 'typedi';
import PasswordValidator from '../src/validators/PasswordValidator';
import Password from '../src/password/Password';

describe('password tests', () => {
  it('a password less than five characters is NOT acceptable', () => {
    let passwordValidator = Container.get(PasswordValidator);

    const invalidPassword = new Password('pass');
    passwordValidator.validate(invalidPassword);

    expect(invalidPassword.isValid()).toBe(false);
  });

  it('a password without at least one digit is NOT acceptable', () => {
    let passwordValidator = Container.get(PasswordValidator);

    const invalidPassword = new Password('password#');
    passwordValidator.validate(invalidPassword);

    expect(invalidPassword.isValid()).toBe(false);
  });

  it('a password containing at least one upper-case character but without a special character is acceptable', () => {
    let passwordValidator = Container.get(PasswordValidator);

    const validPassword = new Password('password1Q');
    passwordValidator.validate(validPassword);

    expect(validPassword.isValid()).toBe(true);
  });

  it('a password containing at least one special character but without an upper-case character is acceptable', () => {
    let passwordValidator = Container.get(PasswordValidator);

    const validPassword = new Password('password1@');
    passwordValidator.validate(validPassword);

    expect(validPassword.isValid()).toBe(true);
  });

  it('a password containing both special and upper-case character is acceptable', () => {
    let passwordValidator = Container.get(PasswordValidator);

    const validPassword = new Password('password1Q@');

    passwordValidator.validate(validPassword);

    expect(validPassword.isValid()).toBe(true);
  });

  it('a password containing two repeated characters is acceptable', () => {
    let passwordValidator = Container.get(PasswordValidator);

    const validPassword = new Password('password1Q@bb');

    passwordValidator.validate(validPassword);

    expect(validPassword.isValid()).toBe(true);
  });

  it('a password containing more than two consecutively repeated characters is NOT acceptable', () => {
    let passwordValidator = Container.get(PasswordValidator);

    const invalidPassword = new Password('password1Q@bbb');
    passwordValidator.validate(invalidPassword);

    expect(invalidPassword.isValid()).toBe(false);
  });
});
