import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { fail, success } from "../utils/response";
import { TaskService } from "../services/taskService";
import { CreateTaskDTO, UpdateTaskStatusDTO } from "../dtos/taskDTO";

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

  async updateTaskStatus(req: any, res: Response, next: NextFunction) {
    try {
      let updateTaskStatusDTO: UpdateTaskStatusDTO = req.body;
      let userId: number = req.user;
      let taskId = req.params.taskId;

      if (taskId) {
        let checkNum = Number(taskId);

        if (!checkNum)
          throw {
            message: "taskId must be a number",
            statusCode: 422,
          };
      }

      let updatedTask = await this.taskService.updateTaskStatus(
        userId,
        taskId,
        updateTaskStatusDTO
      );
      return success(res, 200, updatedTask, "Task updated successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      return fail(res, statusCode, message);
    }
  }

  async updateTaskStatusAdmin(req: any, res: Response, next: NextFunction) {
    try {
      let updateTaskStatusDTO: UpdateTaskStatusDTO = req.body;
      let userId: number = req.user;
      let taskId = req.params.taskId;

      if (taskId) {
        let checkNum = Number(taskId);

        if (!checkNum)
          throw {
            message: "taskId must be a number",
            statusCode: 422,
          };
      }

      let updatedTask = await this.taskService.updateTaskStatus(
        userId,
        taskId,
        updateTaskStatusDTO
      );
      return success(res, 200, updatedTask, "Task updated successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      return fail(res, statusCode, message);
    }
  }
}
