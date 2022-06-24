import { Request, Response, Router } from 'express';
import { MatchController } from '../controllers';
import * as joiSchemas from '../../utils/joi.schemas';
import * as middlewares from '../middlewares';

export default class MatchRouter {
  public router: Router;

  private _matchController: MatchController;

  constructor() {
    this.router = Router();
    this._matchController = new MatchController();

    this.getAll();
    this.getById();
    this.addMatch();
    this.finishMatch();
    this.updateMatchScore();
  }

  private getAll(): void {
    this.router.get('/', async (req: Request, res: Response) => {
      const { inProgress } = req.query;

      if (inProgress === 'true' || inProgress === 'false') {
        const { code, data } = await this._matchController
          .getAll(JSON.parse(inProgress as string));
        return res.status(code).json(data);
      }

      const { code, data } = await this._matchController.getAll();
      return res.status(code).json(data);
    });
  }

  private getById(): void {
    this.router.get('/:id', async (req: Request, res: Response) => {
      const { code, data } = await this._matchController.getById(req.params.id);

      return res.status(code).json(data);
    });
  }

  private addMatch(): void {
    this.router.post(
      '/',
      middlewares.validateJwt,
      middlewares.validateBody(joiSchemas.match),
      async (req: Request, res: Response) => {
        const { code, data } = await this._matchController.addMatch(req.body);

        return res.status(code).json(data);
      },
    );
  }

  private finishMatch(): void {
    this.router.patch('/:id/finish', async (req: Request, res: Response) => {
      const { code, data } = await this._matchController.finishMatch(req.params.id);

      return res.status(code).json(data);
    });
  }

  private updateMatchScore(): void {
    this.router.patch('/:id', async (req: Request, res: Response) => {
      const { code, data } = await this._matchController.updateMatchScore(
        req.params.id,
        req.body,
      );

      return res.status(code).json(data);
    });
  }
}
