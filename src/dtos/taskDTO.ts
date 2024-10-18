import { z } from "zod";

export const validateCreateTask = z.object({
  title: z.string({ message: "title must be a string" }),
  description: z.string({ message: "description must be a string" }),
  dueDate: z.coerce.date({ message: "dueDate must be a valid date" }),
});

export type CreateTaskDTO = z.infer<typeof validateCreateTask>;
