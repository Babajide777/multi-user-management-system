import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { fail, success } from "../utils/response";
import { CreateUserDTO, LoginUserDTO } from "../dtos/userDTO";
import { TaskService } from "../services/taskService";

@Service()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      let request: CreateUserDTO = req.body;
      let createdUser = await this.taskService.createTask();
      return success(res, 201, createdUser, "User created successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      return fail(res, statusCode, message);
    }
  }
}
