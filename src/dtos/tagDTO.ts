import { z } from "zod";

export const validateCreateTag = z.object({
  name: z.string({ message: "name must be a string" }),
});

export type CreateTagDTO = z.infer<typeof validateCreateTag>;
