import express, { Router } from "express";
import Container from "typedi";
import { AuthController } from "../controllers/authController";

const router: Router = express.Router();

const authController = Container.get(AuthController);

router.post("/sign-up", (req, res, next) =>
  authController.signUpUser(req, res, next)
);

router.post("/login", (req, res, next) => authController.login(req, res, next));

export default router;
