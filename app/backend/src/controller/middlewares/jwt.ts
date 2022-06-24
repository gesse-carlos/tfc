import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verify } from '../../utils/jwt';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  try {
    const { id, email, role, username } = verify(authorization) as JwtPayload;

    req.token = { id, email, role, username };
    return next();
  } catch (e: unknown) {
    if (e instanceof Error && e.name.includes('Token')) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return next(e);
  }
};
