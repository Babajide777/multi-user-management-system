import bcrypt from "bcryptjs";

export const hashPassword = (password: string): string => {
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

//To validate user password
export const validatePassword = async (
  formPassword: string,
  dbPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(formPassword, dbPassword);
};
