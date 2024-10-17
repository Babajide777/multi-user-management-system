import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { users } from "./Users";
import { NotificationActionEnum } from "../../utils/enums";
import { tasks } from "./Tasks";

export const notifications = mysqlTable("notifications", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  taskId: int("task_id")
    .references(() => tasks.id)
    .notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  action: mysqlEnum(
    "action",
    Object.values(NotificationActionEnum) as [string, ...string[]]
  ).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  deleted: boolean("deleted").default(false).notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [notifications.taskId],
    references: [tasks.id],
  }),
}));
