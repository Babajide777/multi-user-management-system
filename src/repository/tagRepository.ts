import { Service } from "typedi";
import { db } from "../drizzle/db";
import { tags, tasks } from "../drizzle/Index";
import { SaveDataType } from "./types/save-data.types";
import { eq } from "drizzle-orm";
import { SaveTagType } from "./types/save-tag-type";

@Service()
export class TagRepository {
  private readonly db = db;

  async saveTag(data: SaveTagType): Promise<SaveDataType> {
    const createdTags = await this.db.insert(tags).values(data);
    return createdTags[0].affectedRows > 0
      ? { id: createdTags[0].insertId, success: true }
      : { success: false, id: null };
  }

  async findTagByID(id: number) {
    return await this.db.query.tags.findFirst({
      where: (tags, { eq, and, isNull }) =>
        and(eq(tags.id, id), isNull(tags.deletedAt)),
    });
  }
}
