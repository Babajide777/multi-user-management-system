import { Service } from "typedi";
import { db } from "../drizzle/db";
import { tasks } from "../drizzle/Index";
import { SaveDataType } from "./types/save-data.types";
import { SaveTaskType } from "./types/save-task.type";
import { eq } from "drizzle-orm";
import { Task } from "../dtos/taskDTO";

@Service()
export class TaskRepository {
  private readonly db = db;

  async saveTask(data: SaveTaskType): Promise<SaveDataType> {
    const createdTasks = await this.db.insert(tasks).values(data);
    return createdTasks[0].affectedRows > 0
      ? { id: createdTasks[0].insertId, success: true }
      : { success: false, id: null };
  }

  async findTaskByID(id: number) {
    return await this.db.query.tasks.findFirst({
      where: (tasks, { eq, and, isNull }) =>
        and(eq(tasks.id, id), isNull(tasks.deletedAt)),
      with: {
        tags: true,
        comments: true,
      },
    });
  }

  async editTaskByID(id: number, item: Partial<Task>): Promise<boolean> {
    const updateData: any = { ...item };
    updateData.updatedAt = new Date(Date.now());

    let editedTask = await this.db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id));

    return editedTask[0].affectedRows === 0 ? false : true;
  }
}
