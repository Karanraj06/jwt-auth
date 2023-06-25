import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/users';

export const protect = asyncHandler(
  async (req: Request & { user: IUser }, res: Response, next: NextFunction) => {
    let token: string | undefined;

    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        req.user = (await User.findById(decoded.userId).select(
          '-password'
        )) as IUser;

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);
