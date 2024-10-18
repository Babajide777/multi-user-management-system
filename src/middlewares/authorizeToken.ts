import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../drizzle/env";
import { UserRepository } from "../repository/userRepository";
import { Container } from "typedi";

export const authorizeToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw {
        message: "Token not found",
        statusCode: 401,
      };
    }

    const payload = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;

    const { id } = payload;

    if (!id) {
      throw {
        message: "Invalid token payload",
        statusCode: 400,
      };
    }

    const userRepository = Container.get(UserRepository);

    const user = await userRepository.findUserByID(id);

    if (!user) {
      throw {
        message: "User not found",
        statusCode: 404,
      };
    }

    req.user = user.id;
    req.role = user.role;

    next();
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      message: message,
      payload: [],
    });
  }
};
