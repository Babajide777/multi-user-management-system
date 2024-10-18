import "reflect-metadata";
import { Service } from "typedi";
import { TaskRepository } from "../repository/taskRepository";
import {
  CreateTaskDTO,
  UpdateTaskStatusDTO,
  validateCreateTask,
  validateUpdateTaskStatus,
} from "../dtos/taskDTO";
import { zodErrorObjectToStringConverter } from "../utils/zodErrorObjectToStringConvert";

@Service()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(userId: number, createTaskDTO: CreateTaskDTO) {
    const check = validateCreateTask.safeParse(createTaskDTO);
    if (!check.success) {
      throw {
        message: zodErrorObjectToStringConverter(
          check.error.flatten().fieldErrors
        ),
        statusCode: 400,
      };
    }
    const { title, description, dueDate } = createTaskDTO;

    const savedTask = await this.taskRepository.saveTask({
      title,
      description,
      dueDate: new Date(dueDate),
      userId,
    });
    if (!savedTask.success || !savedTask.id) {
      throw {
        message: "Error creating task",
        statusCode: 500,
      };
    }

    const task = await this.taskRepository.findTaskByID(savedTask.id);
    if (!task) {
      throw {
        message: "Task not found",
        statusCode: 500,
      };
    }

    return { task };
  }

  async updateTaskStatus(
    userId: number,
    taskId: number,
    updateTaskStatusDTO: UpdateTaskStatusDTO
  ) {
    const check = validateUpdateTaskStatus.safeParse(updateTaskStatusDTO);

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

    if (userId !== task.userId) {
      throw {
        message: "You can only change the status of a task that belongs to you",
        statusCode: 403,
      };
    }

    if (task.status == updateTaskStatusDTO.status)
      throw {
        message: "You can not change the status to its current status",
        statusCode: 422,
      };

    const editedTask = await this.taskRepository.editTaskByID(
      taskId,
      updateTaskStatusDTO
    );

    if (!editedTask) {
      throw {
        message: "Error editing task",
        statusCode: 422,
      };
    }

    const theTask = await this.taskRepository.findTaskByID(taskId);

    if (!theTask) {
      throw {
        message: "Task not found",
        statusCode: 404,
      };
    }

    return { task: theTask };
  }
}
