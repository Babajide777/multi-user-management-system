import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { fail, success } from "../utils/response";
import { TaskService } from "../services/taskService";
import { CreateTaskDTO } from "../dtos/taskDTO";

@Service()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async createTask(req: any, res: Response, next: NextFunction) {
    try {
      let createTaskDTO: CreateTaskDTO = req.body;
      let userId: number = req.user;
      let createdTask = await this.taskService.createTask(
        userId,
        createTaskDTO
      );
      return success(res, 201, createdTask, "Task created successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      return fail(res, statusCode, message);
    }
  }
}
