import { Service } from "typedi";
import { db } from "../drizzle/db";
import { tasks } from "../drizzle/Index";
import { SaveDataType } from "./types/save-data.types";
import { SaveTaskType } from "./types/save-task.type";

@Service()
export class TaskRepository {
  private readonly db = db;

  async saveTask(data: SaveTaskType): Promise<SaveDataType> {
    const createdTasks = await this.db.insert(tasks).values(data);
    return createdTasks[0].affectedRows > 0
      ? { id: createdTasks[0].insertId, success: true }
      : { success: false, id: null };
  }
}
