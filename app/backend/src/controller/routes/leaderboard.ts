import { Request, Response, Router } from 'express';
import { LeaderboardController } from '../controllers';

export default class LeaderboardRouter {
  public router: Router;

  private _leaderboardController: LeaderboardController;

  constructor() {
    this.router = Router();
    this._leaderboardController = new LeaderboardController();

    this.getHomeRank();
    this.getAwayRank();
    this.getTeamCapRank();
  }

  private getHomeRank(): void {
    this.router.get('/home', async (_req: Request, res: Response) => {
      const { code, data } = await this._leaderboardController.getHomeRank();
      return res.status(code).json(data);
    });
  }

  private getAwayRank(): void {
    this.router.get('/away', async (_req: Request, res: Response) => {
      const { code, data } = await this._leaderboardController.getAwayRank();
      return res.status(code).json(data);
    });
  }

  private getTeamCapRank(): void {
    this.router.get('/', async (_req: Request, res: Response) => {
      const { code, data } = await this._leaderboardController.getTeamCapRank();
      return res.status(code).json(data);
    });
  }
}
