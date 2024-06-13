import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.util.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { ACCESS_TOKEN_SECRET_KEY } from "../constants/env.constant.js";
import { UsersRepository } from "../repositories/users.repository.js";

export const requireAccessToken = async (req, res, next) => {
  try {
    // 1. req.headers에서 필요한 정보 가져오기 (인증 정보 파싱)
    const authorization = req.headers.authorization;
    // "Authorization: Bearer {{ AccessToken }}" 형태로 존재 (JWT 표준 인증 형태)
    // 예시: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cC..(생략)

    // 2. 정상적인 AccessToken이 존재하니?
    // 2-1. Authorization 자체가 없는 경우 에러!
    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.JWT.NO_TOKEN,
      });
    }
    // 2-2. JWT 표준 인증 형태와 일치하지 않는 경우
    const [tokenType, accessToken] = authorization.split(" ");
    // 2-2-1. Bearer 부분이 없는 경우 에러!
    if (tokenType !== "Bearer") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.JWT.NOT_SUPPORTED_TYPE,
      });
    }
    // 2-2-2. AccessToken이 부분이 없는 경우 에러!
    if (!accessToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.JWT.NO_TOKEN,
      });
    }

    // 3. 정상적인 AccessToken이 있지만 그게 유효한 상태이니?
    let decodedToken;
    let userId;
    try {
      // 3-1. 유효한지 검사해보자! 유효하지 않으면 오류 떠서 catch로 넘어감
      decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY);
      userId = decodedToken.userId;
    } catch (err) {
      // 3-2. AccessToken의 유효기간이 지난 경우 에러!
      if (err.name === "TokenExpiredError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.JWT.EXPIRED,
        });
      }
      // 3-3. 그 밖의 AccessToken 검증에 실패한 경우 에러!
      else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: MESSAGES.AUTH.JWT.ETC_INVALID,
        });
      }
    }

    // 4. AccessToken 자체는 유효하지만 사용자는?
    // 4-1. Payload에 담긴 사용자 ID와 일치하는 user 조회
    const usersRepository = new UsersRepository();
    const user = await usersRepository.findUserById(userId);
    // 4-2. 일치하는 user가 없는 경우 에러!
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.AUTH.JWT.NO_USER_MATCHED,
      });
    }

    // 5. 인증이 완료된 user의 정보를 req.user에 담기
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
