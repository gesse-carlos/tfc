import { Request, Response, Router } from 'express';
import { ClubFactory } from '../../utils/factory';

export default class Club {
  public router: Router;

  public clubController = ClubFactory();

  constructor() {
    this.router = Router();
    this.route();
  }

  private route(): void {
    this.router.get(
      '/',
      async (req: Request, res: Response) => {
        const { code, data } = await this.clubController.getAll();
        return res.status(code).json(data);
      },
    );

    this.router.get(
      '/:id',
      async (req: Request, res: Response) => {
        const { code, data } = await this.clubController.getById(req.params.id);
        return res.status(code).json(data);
      },
    );
  }
}
