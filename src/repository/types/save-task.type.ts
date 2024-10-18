import { TaskStatusEnum } from "../../utils/enums";

export type SaveTaskType = {
  userId: number;
  title: string;
  description: string;
  status: TaskStatusEnum;
  dueDate: Date;
};
