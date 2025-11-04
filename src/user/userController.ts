import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";
import type { User } from "./userTypes.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User already exist");
      return next(error);
    }
  } catch (error) {
    const err = createHttpError(500, "Error while creating user");
    return next(err);
  }

  let newUser: User;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    const err = createHttpError(500, "Something went wrong");
    return next(err);
  }

  try {
    const token = jwt.sign(
      { sub: newUser._id },
      config.jwtSecretKey as string,
      {
        expiresIn: "3d",
        algorithm: "HS256",
      }
    );

    return res.json({
      accessToken: token,
    });
  } catch (error) {
    const err = createHttpError(500, "Something went wrong");
    return next(err);
  }
};

export { createUser };
