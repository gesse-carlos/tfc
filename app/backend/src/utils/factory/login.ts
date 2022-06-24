import { compare } from 'bcryptjs';
import { LoginService } from '../../service';
import { LoginController } from '../../controller/controllers';
import { UserRepository } from '../repository';

export default (): LoginController => {
  const loginService = new LoginService(UserRepository, compare);

  return new LoginController(loginService);
};
