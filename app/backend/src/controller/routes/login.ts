import { Request, Response, Router } from 'express';
import { ILoginController, IPayload } from '../../utils/interfaces';
import { LoginFactory } from '../../utils/factory';
import { validateBody, validateJwt } from '../middlewares';
import * as joiSchemas from '../../utils/joi.schemas';

export default class Login {
  public router: Router;

  public loginController: ILoginController = LoginFactory();

  constructor() {
    this.router = Router();
    this.route();
  }

  private route(): void {
    this.router.post(
      '/',
      validateBody(joiSchemas.login),
      async (req: Request, res: Response) => {
        const { code, data } = await this.loginController.login(req.body);
        return res.status(code).json(data);
      },
    );

    this.router.get(
      '/validate',
      validateJwt,
      async (req: Request, res: Response) => {
        const { code, data } = this.loginController.validate(req.token as IPayload);
        return res.status(code).send(data);
      },
    );
  }
}
