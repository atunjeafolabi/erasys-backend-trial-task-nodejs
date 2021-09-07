import * as express from 'express';
import { Container } from 'typedi';
import PasswordCheckerController from './../controllers/PasswordCheckerController';

let router = express.Router();

let passwordCheckerController = Container.get(PasswordCheckerController);

router.post(
  '/passwords',
  passwordCheckerController.password.bind(passwordCheckerController)
);

export default router;
