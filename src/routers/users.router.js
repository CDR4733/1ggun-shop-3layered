import express from "express";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";
import { UsersController } from "../controllers/users.controller.js";

const usersRouter = express.Router();

// UsersController를 인스턴스화 시킨다.
const usersController = new UsersController();

/** 내 정보 조회 API R **/
usersRouter.get("/me", requireAccessToken, usersController.getMyInfo);

export { usersRouter };
