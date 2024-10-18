import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { TaskStatusEnum } from "../utils/enums";
import { tasks } from "../drizzle/Index";

export const validateCreateTask = z.object({
  title: z.string({ message: "title must be a string" }),
  description: z.string({ message: "description must be a string" }),
  dueDate: z.coerce.date({ message: "dueDate must be a valid date" }),
});

export type CreateTaskDTO = z.infer<typeof validateCreateTask>;

export const validateUpdateTaskStatus = z.object({
  status: z.enum(Object.values(TaskStatusEnum) as [string, ...string[]], {
    message: `status must be one of ${Object.values(TaskStatusEnum)}`,
  }),
});

export type UpdateTaskStatusDTO = z.infer<typeof validateUpdateTaskStatus>;

export const validateTask = createInsertSchema(tasks);

export type Task = z.infer<typeof validateTask>;
