import { HTTP_STATUS } from "../constants/http-status.constant.js";

export const errorHandler = (err, req, res, next) => {
  // 에러를 출력합니다.
  console.error(err);

  // joi에서 발생한 에러 처리
  if (err.name === "ValidationError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: HTTP_STATUS.BAD_REQUEST,
      message: err.message,
    });
  }

  // 그 밖의 예상치 못한 에러 처리
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorMessage: "서버 내부 에러가 발생했습니다.",
  });
};
