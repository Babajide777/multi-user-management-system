import express, { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { authorizeToken } from "../middlewares/authorizeToken";
import { roleChecker } from "../middlewares/roleChecker";
import { UserRoleEnum } from "../utils/enums";
import { TaskController } from "../controllers/taskController";

const router: Router = express.Router();

const taskController = Container.get(TaskController);

router.post(
  "/",
  authorizeToken,
  roleChecker(UserRoleEnum.user),
  (req: Request, res: Response, next: NextFunction) => {
    taskController.createTask(req, res, next);
  }
);

export default router;
