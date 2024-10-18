import "reflect-metadata";
import { Service } from "typedi";
import { UserRepository } from "../repository/userRepository";
import { createRefreshToken } from "../utils/jwt";
import { hashPassword, validatePassword } from "../utils/passwordHash";
import {
  CreateUserDTO,
  LoginUserDTO,
  validateCreateUser,
  validateLoginUser,
} from "../dtos/userDTO";

@Service()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUpUser(data: CreateUserDTO) {
    const check = validateCreateUser.safeParse(data);
    if (!check.success)
      throw new Error(JSON.stringify(check.error.flatten().fieldErrors));

    const checkUser = await this.userRepository.findUserByEmail(data.email);
    if (checkUser) throw new Error("User already exists");

    data.password = hashPassword(data.password);

    const savedUser = await this.userRepository.saveUser(data);

    if (!savedUser.success || !savedUser.id)
      throw new Error("Error creating user");

    let token = createRefreshToken(savedUser.id);
    let user = await this.userRepository.findUserByID(savedUser.id);

    if (!user) throw new Error("User not found");

    return {
      ...user,
      token,
    };
  }

  async loginUser(data: LoginUserDTO) {
    const check = validateLoginUser.safeParse(data);
    if (!check.success)
      throw new Error(JSON.stringify(check.error.flatten().fieldErrors));

    const checkUser = await this.userRepository.findUserByEmail(data.email);
    if (!checkUser) throw new Error("Wrong Email or password");

    let passwordCheck = await validatePassword(
      data.password,
      checkUser.password
    );

    if (!passwordCheck) throw new Error("Wrong Email or password");

    let token = createRefreshToken(checkUser.id);

    return {
      user: checkUser,
      token,
    };
  }
}
