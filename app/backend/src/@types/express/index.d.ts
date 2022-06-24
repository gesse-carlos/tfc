import { IPayload } from '../../utils/interfaces';

declare global {
  namespace Express {
    interface Request {
      token?: IPayload
    }
  }
}
