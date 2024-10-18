import { Service } from "typedi";
import { AuthService } from "../services/authService";
import { Request, Response, NextFunction } from "express";
import { isJSON } from "../utils/isJSON";
import { fail, success } from "../utils/response";
import { CreateUserDTO, LoginUserDTO } from "../dtos/userDTO";

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      let request: CreateUserDTO = req.body;
      let createdUser = await this.authService.signUpUser(request);
      return success(res, 201, createdUser, "User created successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = isJSON(error.message) || "Internal Server Error";
      return fail(res, statusCode, message);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginUserDTO = req.body;
      const user = await this.authService.loginUser(request);
      return success(res, 200, user, "User login success");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = isJSON(error.message) || "Internal Server Error";
      return fail(res, statusCode, message);
    }
  }
}
