import "reflect-metadata";
import { Service } from "typedi";
import { TaskRepository } from "../repository/taskRepository";
import { CreateTaskDTO, validateCreateTask } from "../dtos/taskDTO";
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
}
