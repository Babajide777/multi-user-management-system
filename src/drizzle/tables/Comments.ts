import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  text,
} from "drizzle-orm/mysql-core";
import { tasks } from "./Tasks";
import { users } from "./Users";

export const comments = mysqlTable("comments", {
  id: int("id").primaryKey().autoincrement(),
  taskId: int("task_id")
    .references(() => tasks.id)
    .notNull(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  deleted: boolean("deleted").default(false).notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));
