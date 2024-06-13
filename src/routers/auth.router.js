import express from "express";
import { signUpValidator } from "../middlewares/validators/sign-up-validator.middleware.js";
import { logInValidator } from "../middlewares/validators/log-in-validator.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// AuthController를 인스턴스화 시킨다.
const authController = new AuthController();

/** 회원가입 API **/
authRouter.post("/sign-up", signUpValidator, authController.signUp);

/** 로그인 API **/
authRouter.post("/log-in", logInValidator, authController.logIn);

export { authRouter };
