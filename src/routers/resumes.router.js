import express from "express";
import { prisma } from "../utils/prisma.util.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { createResumeValidator } from "../middlewares/validators/create-resume-validator.middleware.js";
import { updateResumeValidator } from "../middlewares/validators/update-resume-validator.middleware.js";
import { ResumesController } from "../controllers/resumes.controller.js";

const resumesRouter = express.Router();

// ResumesController를 인스턴스화 시킨다.
const resumesController = new ResumesController();

/** 이력서 생성 API C **/
resumesRouter.post(
  "/",
  requireAccessToken,
  createResumeValidator,
  resumesController.createResume,
);

/** 이력서 목록 조회 API R-1 **/
resumesRouter.get("/", requireAccessToken, resumesController.getResumes);

/** 이력서 상세 조회 API R-2 **/
resumesRouter.get(
  "/:resumeId",
  requireAccessToken,
  resumesController.getResumeById,
);

/** 이력서 수정 API U **/
resumesRouter.patch(
  "/:resumeId",
  requireAccessToken,
  updateResumeValidator,
  resumesController.updateResume,
);

/** 이력서 삭제 API D **/
resumesRouter.delete(
  "/:resumeId",
  requireAccessToken,
  resumesController.deleteResume,
);

export { resumesRouter };
