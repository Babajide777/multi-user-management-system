import "reflect-metadata";
import { Service } from "typedi";
import { zodErrorObjectToStringConverter } from "../utils/zodErrorObjectToStringConvert";
import { TagRepository } from "../repository/tagRepository";
import { CreateTagDTO, validateCreateTag } from "../dtos/tagDTO";
import { TaskRepository } from "../repository/taskRepository";

@Service()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly taskRepository: TaskRepository
  ) {}

  async createTag(userId: number, taskId: number, createTagDTO: CreateTagDTO) {
    const check = validateCreateTag.safeParse(createTagDTO);

    if (!check.success) {
      throw {
        message: zodErrorObjectToStringConverter(
          check.error.flatten().fieldErrors
        ),
        statusCode: 400,
      };
    }

    const task = await this.taskRepository.findTaskByID(taskId);
    if (!task) {
      throw {
        message: "Task not found",
        statusCode: 404,
      };
    }

    const savedTag = await this.tagRepository.saveTag({
      ...createTagDTO,
      taskId,
    });
    if (!savedTag.success || !savedTag.id) {
      throw {
        message: "Error creating tag",
        statusCode: 500,
      };
    }

    const tag = await this.tagRepository.findTagByID(savedTag.id);
    if (!tag) {
      throw {
        message: "Tag not found",
        statusCode: 500,
      };
    }

    return { tag };
  }
}
