import { z } from "zod";

export const validateCreateUser = z.object({
  firstName: z.string({ message: "first name must be a string" }),
  lastName: z.string({ message: "last name must be a string" }),
  email: z
    .string({ message: "email must be a string" })
    .email({ message: "email must be a valid email" }),
  password: z
    .string({ message: "password must be a string" })
    .min(8, { message: "Password must be a least 8 characters" }),
});

export type CreateUserDTO = z.infer<typeof validateCreateUser>;

export const validateLoginUser = z.object({
  email: z
    .string({ message: "email must be a string" })
    .email({ message: "email must be a valid email" }),
  password: z
    .string({ message: "password must be a string" })
    .min(8, { message: "Password must be a least 8 characters" }),
});

export type LoginUserDTO = z.infer<typeof validateLoginUser>;
