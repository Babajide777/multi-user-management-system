import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { UserRoleEnum } from "../../utils/enums";
import { tasks } from "./Tasks";
import { comments } from "./Comments";
import { notifications } from "./Notifications";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  role: mysqlEnum("role", Object.values(UserRoleEnum) as [string, ...string[]])
    .default(UserRoleEnum.user)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
  deleted: boolean("deleted").default(false).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  comments: many(comments),
  notifications: many(notifications),
}));
