import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.util.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { ACCESS_TOKEN_SECRET_KEY } from "../constants/env.constant.js";
import {
  HASH_SALT_ROUNDS,
  ACCESS_TOKEN_EXPIRES_IN,
} from "../constants/auth.constant.js";
import { signUpValidator } from "../middlewares/validators/sign-up-validator.middleware.js";
import { logInValidator } from "../middlewares/validators/log-in-validator.middleware.js";

const authRouter = express.Router();

/** 회원가입 API **/
authRouter.post("/sign-up", signUpValidator, async (req, res, next) => {
  try {
    // 1. 필요한 정보를 가져오기
    const { email, password, passwordConfirm, name } = req.body;

    // 2. 이미 가입된 이메일인지?
    // 2-1. 해당 이메일이 DB에 있는지 확인
    const existingEmail = await prisma.users.findUnique({
      where: { email },
    });
    // 2-2. 이미 가입된 이메일이라면 에러
    if (existingEmail) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: HTTP_STATUS.CONFLICT,
        message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED,
      });
    }

    // 3. 회원가입 진행
    // 3-1. 비밀번호 hash하기
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);
    // 3-2. 위 data를 종합하여 회원가입
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    // 3-3. userInfo도 생성
    const userInfo = await prisma.userInfos.create({
      data: {
        UserId: user.userId,
        email,
        name,
      },
    });

    // 4. 회원가입 결과를 클라이언트에 반환
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      userInfo,
    });
  } catch (err) {
    next(err);
  }
});

/** 로그인 API **/
authRouter.post("/log-in", logInValidator, async (req, res, next) => {
  try {
    // 1. 필요한 정보 가져오기
    // 1-1. req.body에서 입력받은 정보 가져오기
    const { email, password } = req.body;
    // 1-2. 해당 email로 가입된 user가 있는지 조회
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // 2. 만약 해당 user가 존재한다면 비밀번호가 일치하는지 검사
    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);

    // 3. 만약 password가 일치하지 않는다면 에러
    if (!isPasswordMatched) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.LOG_IN.UNAUTHORIZED,
      });
    }

    // 4. Access Token 발행
    const payload = { userId: user.userId };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }); // payload, 비밀키, 옵션(만료기간 등) 순으로 입력가능

    // 5. 로그인 결과를 클라이언트에 반환
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.LOG_IN.SUCCEED,
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

export { authRouter };
