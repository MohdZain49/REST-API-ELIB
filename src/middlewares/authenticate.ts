import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      const error = createHttpError(401, "unauthorized request");
      return next(error);
    }

    const parsedToken = token.split(" ")[1];

    const decodedToken = jwt.verify(parsedToken, config.jwtSecretKey as string);

    const _req = req as AuthRequest;

    _req.userId = decodedToken.sub as string;

    next();
  } catch (error) {
    const err = createHttpError(500, "something went wrong");
    return next(err);
  }
};

export default authenticate;
