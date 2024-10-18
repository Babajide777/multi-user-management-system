import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { fail, success } from "../utils/response";
import { TagService } from "../services/tagService";
import { CreateTagDTO } from "../dtos/tagDTO";

@Service()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  async createTag(req: any, res: Response, next: NextFunction) {
    try {
      let createTagDTO: CreateTagDTO = req.body;
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

      let updatedTask = await this.tagService.createTag(
        userId,
        taskId,
        createTagDTO
      );
      return success(res, 201, updatedTask, "Tag created successfully");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      return fail(res, statusCode, message);
    }
  }
}
