import express, { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { authorizeToken } from "../middlewares/authorizeToken";
import { roleChecker } from "../middlewares/roleChecker";
import { UserRoleEnum } from "../utils/enums";
import { TagController } from "../controllers/tagController";

const router: Router = express.Router();

const tagController = Container.get(TagController);

router.post(
  "/:taskId",
  authorizeToken,
  roleChecker(UserRoleEnum.user),
  (req: Request, res: Response, next: NextFunction) => {
    tagController.createTag(req, res, next);
  }
);

export default router;
