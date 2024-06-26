import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { HttpError } from "../errors/http.error.js";

export const errorHandler = (err, req, res, next) => {
  // 에러를 출력합니다.
  console.error(err);

  // 만약에 HttpError에 포함된 종류의 에러라면 해당 status와 message 출력
  if (err.constructor.name in HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

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
    // 만약 에러메세지가 따로 있으면 그 메세지를 출력하고, 아니면 "서버 내부~" 출력
    errorMessage: err.message || "서버 내부 에러가 발생했습니다.",
  });
};
