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
import { zodErrorObjectToStringConverter } from "../utils/zodErrorObjectToStringConvert";
import { UserRoleEnum } from "../utils/enums";

@Service()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUpUser(data: CreateUserDTO) {
    const check = validateCreateUser.safeParse(data);
    if (!check.success) {
      throw {
        message: zodErrorObjectToStringConverter(
          check.error.flatten().fieldErrors
        ),
        statusCode: 400,
      };
    }

    const checkUser = await this.userRepository.findUserByEmail(data.email);
    if (checkUser) {
      throw {
        message: "User already exists",
        statusCode: 409,
      };
    }

    data.password = hashPassword(data.password);

    const savedUser = await this.userRepository.saveUser(data);
    if (!savedUser.success || !savedUser.id) {
      throw {
        message: "Error creating user",
        statusCode: 500,
      };
    }

    const token = createRefreshToken(savedUser.id);

    const user = await this.userRepository.findUserByID(savedUser.id);
    if (!user) {
      throw {
        message: "User not found",
        statusCode: 500,
      };
    }

    return {
      user,
      token,
    };
  }

  async loginUser(data: LoginUserDTO) {
    const check = validateLoginUser.safeParse(data);
    if (!check.success) {
      throw {
        message: zodErrorObjectToStringConverter(
          check.error.flatten().fieldErrors
        ),
        statusCode: 400,
      };
    }

    const checkUser = await this.userRepository.findUserByEmail(data.email);
    if (!checkUser) {
      throw {
        message: "Wrong Email or password",
        statusCode: 401,
      };
    }

    const passwordCheck = await validatePassword(
      data.password,
      checkUser.password
    );
    if (!passwordCheck) {
      throw {
        message: "Wrong Email or password",
        statusCode: 401,
      };
    }

    const token = createRefreshToken(checkUser.id);

    return {
      user: checkUser,
      token,
    };
  }

  async signUpAdmin(data: CreateUserDTO) {
    const check = validateCreateUser.safeParse(data);
    if (!check.success) {
      throw {
        message: zodErrorObjectToStringConverter(
          check.error.flatten().fieldErrors
        ),
        statusCode: 400,
      };
    }

    const checkAdmin = await this.userRepository.findUserByEmail(data.email);
    if (checkAdmin) {
      throw {
        message: "Admin already exists",
        statusCode: 409,
      };
    }

    data.password = hashPassword(data.password);

    const savedAdmin = await this.userRepository.saveUser({
      ...data,
      role: UserRoleEnum.admin,
    });
    if (!savedAdmin.success || !savedAdmin.id) {
      throw {
        message: "Error creating admin",
        statusCode: 500,
      };
    }

    const token = createRefreshToken(savedAdmin.id);

    const admin = await this.userRepository.findUserByID(savedAdmin.id);
    if (!admin) {
      throw {
        message: "Admin not found",
        statusCode: 500,
      };
    }

    return {
      admin,
      token,
    };
  }
}
