import { UserRoleEnum } from "../../utils/enums";

export type SaveUserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRoleEnum;
};
