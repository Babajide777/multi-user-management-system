import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { tasks } from "./Tasks";

export const tags = mysqlTable("tags", {
  id: int("id").primaryKey().autoincrement(),
  taskId: int("task_id")
    .references(() => tasks.id)
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  deleted: boolean("deleted").default(false).notNull(),
});

export const tagsRelations = relations(tags, ({ one }) => ({
  task: one(tasks, {
    fields: [tags.taskId],
    references: [tasks.id],
  }),
}));
