import "reflect-metadata";
import { Service } from "typedi";
import {
  validateCreateUser,
  CreateUserDTO,
  validateLoginUser,
  LoginUserDTO,
  RequestPasswordDTO,
  validateRequestPasswordReset,
  ResetPasswordDTO,
  validateUserPasswordReset,
} from "../dto/userDTO";
import { UserRepository } from "../repository/userRepository";
import { Response } from "express";
import { checkJwt, createAccessToken, createRefreshToken } from "../utils/jwt";
import { fail } from "../utils/response";
import { hashPassword, validatePassword } from "../utils/passwordHash";
import { decrypt, encrypt } from "../utils/encryptDecrypt";
import { createMail } from "../utils/createMail";

@Service()
export class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}

  async signUpUser(data: CreateUserDTO, res: Response) {
    const check = validateCreateUser.safeParse(data);
    if (!check.success)
      throw new Error(JSON.stringify(check.error.flatten().fieldErrors));

    const checkUser = await this._userRepository.getUserUsingEmail(data.email);
    if (checkUser) throw new Error("User already exists");

    data.password = hashPassword(data.password);

    const savedUser = await this._userRepository.saveUser(data);
    if (!savedUser[0]) throw new Error(`${savedUser[1]}`);

    let user: any = savedUser[1];

    let accessToken = createAccessToken(user._id);
    let refreshToken = createRefreshToken(user._id);

    let editUser = await this._userRepository.editUserUsingId(user._id, {
      refreshToken,
    });

    if (!editUser) throw new Error("Error updating refresh token");

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 30,
      // secure: true,
    });

    return {
      user: editUser,
      token: accessToken,
    };
  }

  async loginUser(data: LoginUserDTO, res: Response) {
    const check = validateLoginUser.safeParse(data);
    if (!check.success)
      throw new Error(JSON.stringify(check.error.flatten().fieldErrors));

    const checkUser: any = await this._userRepository.getUserUsingEmail(
      data.email
    );
    if (!checkUser) throw new Error("Wrong Email or password");

    let passwordCheck = await validatePassword(
      data.password,
      checkUser.password
    );

    if (!passwordCheck) throw new Error("Wrong Email or password");

    let accessToken = createAccessToken(checkUser._id);
    let refreshToken = createRefreshToken(checkUser._id);

    let editUser = await this._userRepository.editUserUsingId(checkUser._id, {
      refreshToken,
    });

    if (!editUser) throw new Error("Error updating refresh token");

    res.cookie("jwt", refreshToken, {
      // domain: "http://127.0.0.1:5173",
      httpOnly: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 30,
    });

    return {
      user: editUser,
      token: accessToken,
    };
  }
}
