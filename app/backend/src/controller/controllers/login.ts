import {
  ICredential, ILoginController, ILoginService, IPayload,
} from '../../utils/interfaces';

export default class LoginController implements ILoginController {
  private sucessCode = 200;

  private role: IPayload['role'];

  constructor(
    private loginService: ILoginService,
  ) {}

  async login(credential: ICredential) {
    return this.loginService.login(credential);
  }

  validate(token: IPayload) {
    this.role = token.role;

    return { code: this.sucessCode, data: this.role };
  }
}
