import { Service } from "typedi";
import "reflect-metadata";
import { AuthService } from "../services/authService";
import { Request, Response, NextFunction } from "express";
import { isJSON } from "../utils/isJSON";
import { fail, success } from "../utils/response";
import {
  CreateUserDTO,
  LoginUserDTO,
  RequestPasswordDTO,
  ResetPasswordDTO,
} from "../dto/userDTO";

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      let request: CreateUserDTO = req.body;
      let createdUser = await this.authService.signUpUser(request, res);
      return success(res, 201, createdUser, "User created successfully");
    } catch (error: any) {
      let message = isJSON(error.message);
      return fail(res, 400, message);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      let request: LoginUserDTO = req.body;
      let user = await this.authService.loginUser(request, res);
      return success(res, 200, user, "User login success");
    } catch (error: any) {
      let message = isJSON(error.message);
      return fail(res, 400, message);
    }
  }
}
