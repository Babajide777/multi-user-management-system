import express, { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { AuthController } from "../controllers/authController";

const router: Router = express.Router();

const authController = Container.get(AuthController);

router.post("/sign-up", (req: Request, res: Response, next: NextFunction) => {
  authController.signUpUser(req, res, next);
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  authController.login(req, res, next);
});

export default router;
