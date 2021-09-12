#! /usr/bin/env node
import 'reflect-metadata';
import PasswordChecker from './checker';
import figlet from 'figlet';
import dotenv from 'dotenv';
import { Password } from './entity/password';
import { createConnection } from 'typeorm';

dotenv.config();

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

async function passwordCheck() {
  await createConnection();

  const passwordChecker = new PasswordChecker();
  const passwords = await Password.find();

  passwords.forEach((password: Password) => {
    passwordChecker.check(password);
  });
}

passwordCheck();

// console.log(process.argv);
