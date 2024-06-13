import express from "express";
import { prisma } from "../utils/prisma.util.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

const usersRouter = express.Router();

/** 내 정보 조회 API R **/
usersRouter.get("/me", requireAccessToken, async (req, res, next) => {
  try {
    // 1. 필요한 정보 가져오기
    const { userId } = req.user;
    // 2. userId를 바탕으로 UserInfors 테이블에서 데이터 조회
    const userInfo = await prisma.userInfos.findUnique({
      where: { UserId: +userId },
    });
    // 3. 내 정보 조회 결과를 클라이언트에 반환
    userInfo.userInfoId = undefined;
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data: userInfo,
    });
  } catch (err) {
    next(err);
  }
});

export { usersRouter };
