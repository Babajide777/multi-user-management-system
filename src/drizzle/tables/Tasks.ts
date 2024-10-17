import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/mysql-core";
import { users } from "./Users";
import { TaskStatusEnum } from "../../utils/enums";
import { tags } from "./Tags";
import { comments } from "./Comments";

export const tasks = mysqlTable("tasks", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum(
    "status",
    Object.values(TaskStatusEnum) as [string, ...string[]]
  )
    .default(TaskStatusEnum.toDo)
    .notNull(),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  deleted: boolean("deleted").default(false).notNull(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  tags: many(tags),
  comments: many(comments),
}));
