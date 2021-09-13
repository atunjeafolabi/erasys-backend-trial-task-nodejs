#! /usr/bin/env node
import 'reflect-metadata';
import PasswordChecker from './checker';
import figlet from 'figlet';
import dotenv from 'dotenv';
import { Password } from './entity/password';
import { createConnection } from 'typeorm';
import yargs from 'yargs';

dotenv.config();

const args: any = yargs(process.argv.slice(2)).argv;

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

// If this option is passed, the valid field will be updated in the database
const shouldUpdateValidField: boolean = args.updateValid;

async function passwordCheck(shouldUpdateValidField: boolean) {
  await createConnection();

  const passwordChecker = new PasswordChecker();
  const passwords = await Password.find();

  passwords.forEach((password: Password) => {
    passwordChecker.check(password, shouldUpdateValidField);
  });
}

passwordCheck(shouldUpdateValidField);

// process.exit(0);
