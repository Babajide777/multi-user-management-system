import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../drizzle/env";

// create and sign json web token
export const createRefreshToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET as string, {
    expiresIn: 60 * 60 * 24 * 30,
  });
};

export const checkJwt = async (jwtID: string) => {
  return jwt.verify(jwtID, JWT_SECRET as string);
};
