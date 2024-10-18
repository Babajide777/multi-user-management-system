import { NextFunction, Response } from "express";
import { fail } from "../utils/response";
import { isJSON } from "../utils/isJSON";
import { UserRoleEnum } from "../utils/enums";

export const roleChecker = (role: UserRoleEnum) => {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.role) {
        throw {
          message: "User is not authorized to perform this action",
          statusCode: 403,
        };
      }

      let userRole = req.role as UserRoleEnum;

      if (userRole !== role) {
        throw {
          message: "User is not authorized to perform this action",
          statusCode: 403,
        };
      }

      next();
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = isJSON(error.message) || "Internal Server Error";
      res.status(statusCode).json(fail(res, statusCode, message));
    }
  };
};
