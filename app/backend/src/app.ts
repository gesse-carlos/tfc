import * as express from 'express';
import 'express-async-errors';
import {
  ClubRouter,
  LoginRouter,
  MatchRouter,
  LeaderboardRouter,
} from './controller/routes';
import { handleErrors } from './controller/middlewares';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    this.route();
    this.handleErrors();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
  }

  private route(): void {
    this.app.use('/login', new LoginRouter().router);
    this.app.use('/clubs', new ClubRouter().router);
    this.app.use('/matchs', new MatchRouter().router);
    this.app.use('/leaderboard', new LeaderboardRouter().router);
  }

  private handleErrors(): void {
    this.app.use(handleErrors);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on ${PORT}...`));
  }
}

export { App };

export const { app } = new App();
