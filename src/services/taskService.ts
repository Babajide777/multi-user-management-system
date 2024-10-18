import "reflect-metadata";
import { Service } from "typedi";
import { TaskRepository } from "../repository/taskRepository";

@Service()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask() {}
}
