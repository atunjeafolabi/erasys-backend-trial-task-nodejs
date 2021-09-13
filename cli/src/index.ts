#! /usr/bin/env node
import App from './bootstrap/app';
import yargs from 'yargs';

const args: any = yargs(process.argv.slice(2)).argv;
const shouldUpdateValidField: boolean = args.updateValid;

const app = new App();
app.passwordCheck(shouldUpdateValidField);

console.log('Press ctrl C to exit');
