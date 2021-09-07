import 'reflect-metadata';
import express from 'express';
import routes from '../routes';

/**
 * This class contains the app setup usually done within server.ts
 *
 * The reason for extracting the setup into its own class is to enable reuse of
 * a single 'app' instance when testing api (i.e controller) endpints.
 */
class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setup();
    this.routers();
  }

  setup() {
    this.app.use(express.json());
  }

  routers() {
    this.app.use('/', routes);
  }
}

export default new App().app;
