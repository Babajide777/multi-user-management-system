import express, { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { AuthController } from "../controllers/authController";
import { authorizeToken } from "../middlewares/authorizeToken";
import { roleChecker } from "../middlewares/roleChecker";
import { UserRoleEnum } from "../utils/enums";

const router: Router = express.Router();

const authController = Container.get(AuthController);

router.post("/sign-up", (req: Request, res: Response, next: NextFunction) => {
  authController.signUpUser(req, res, next);
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  authController.login(req, res, next);
});

router.post(
  "/sign-up-admin",
  authorizeToken,
  roleChecker(UserRoleEnum.admin),
  (req: Request, res: Response, next: NextFunction) => {
    authController.signUpAdmin(req, res, next);
  }
);

export default router;
