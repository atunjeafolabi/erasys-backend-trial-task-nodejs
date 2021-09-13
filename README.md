# Password Checker

## Overview

This is a solution to Erasys trial task for back-end developers.

The solution is structured into two parts:

- `api`
  - an endpoint to check the validity of a password according to preset rules
- `cli`
  - a CLI script for reading password records from a database and validating each of them via the api developed above and also with the provided endpoint for checking compromised passwords.

The password rules for the `api` are stored in a separate json file located in `config/PasswordRules.json`. This file consits of the rules with the key being the regex pattern and the value being the corresponding error message. Furthermore, the MySQL connection settings for the CLI script is located in a separate file `ormconfig.js` in `cli` folder

## Tech Stack

- NodeJS
- Typescript
- Express (for the api)
- MySQL (using TypeORM)

## Libraries

A few libraries used in this project include:

- express
- axios
- chalk
- dotenv
- figlet
- yargs
- http-status-codes
- mysql
- typedi
- typeorm
- jest
- supertest

#### Linters

- xo
- prettier

## Setup

- Clone the project: `git clone https://gitlab.com/atunje_afolabi/erasys-backend-trial-task-nodejs.git`
- `api`
  - `cd` into the `api` folder
  - Run `npm install` to install dependencies
  - Run `npm run dev` to start local server
- `cli`
  - Create a database named `testdb`
  - Load the `sqldump.sql` into the database
  - `cd` into the `cli` folder
  - Run `npm install`
- Docker Container
  - Pull the docker image
    - `docker pull erasys/compromised-pw-api:1.0.1`
  - Start the docker container
    - `docker run -p 5000:5000 -t erasys/compromised-pw-api:1.0.1`

## Usage

To run the CLI script:

- Run `npm run pwchecker` from the `cli` folder. This only checks if a passord is valid and compromised but does not update the valid field of the database.
- To update the database, run `npm run pwchecker -- --updateValid`

## Screenshots

#### The CLI

![The CLI](screenshots/cli.png)

## Running Test

- `api`
  - Run `npm run test`
- `cli`
  - Create a separate database named `test-database`
  - Create a table with:
  ```sql
  CREATE TABLE passwords ( password VARCHAR(20) NOT NULL, valid INT NULL DEFAULT NULL, PRIMARY KEY (password) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  ```
  - Run `npm run test`

## Future Work

- Improve user interface of the CLI
- Add more tests
- Add database migration for automaic table creation during testing
- Make the CLI application globally installable
- Further refactoring of the codebase

## Issues

- For any issue, kindly create a new [issue](https://gitlab.com/atunje_afolabi/erasys-backend-trial-task-nodejs/-/issues).

Danke!
