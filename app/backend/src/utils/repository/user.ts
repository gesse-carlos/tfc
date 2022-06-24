import { IUser } from '../interfaces';
import { UserModel } from '../../database/models';

export default class UsersRepository {
  static async getByEmail(email: string): Promise<IUser | null> {
    return (await UserModel.findOne(
      { where: { email } },
    ))?.get({ plain: true });
  }
}
