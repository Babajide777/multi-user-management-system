import { Service } from "typedi";
import { db } from "../drizzle/db";
import { users } from "../drizzle/Index";
import { SaveUserType } from "./types/save-user.type";
import { SaveDataType } from "./types/save-data.types";

@Service()
export class UserRepository {
  private readonly db = db;

  async saveUser(data: SaveUserType): Promise<SaveDataType> {
    const createdUsers = await this.db.insert(users).values(data);
    return createdUsers[0].affectedRows > 0
      ? { id: createdUsers[0].insertId, success: true }
      : { success: false, id: null };
  }

  async findUserByEmail(email: string) {
    return await this.db.query.users.findFirst({
      where: (users, { eq, and, isNull }) =>
        and(eq(users.email, email), isNull(users.deletedAt)),
    });
  }

  async findUserByID(id: number) {
    return await this.db.query.users.findFirst({
      where: (users, { eq, and, isNull }) =>
        and(eq(users.id, id), isNull(users.deletedAt)),
    });
  }
}
