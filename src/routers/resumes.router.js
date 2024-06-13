import express from "express";
import { prisma } from "../utils/prisma.util.js";
import { requireAccessToken } from "../middlewares/require-access-token.middleware.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { createResumeValidator } from "../middlewares/validators/create-resume-validator.middleware.js";
import { updateResumeValidator } from "../middlewares/validators/update-resume-validator.middleware.js";

const resumesRouter = express.Router();

/** 이력서 생성 API C **/
resumesRouter.post(
  "/",
  requireAccessToken,
  createResumeValidator,
  async (req, res, next) => {
    try {
      // 1. 필요한 데이터 가져오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.body에 입력된 데이터들 가져오기
      const { resumeTitle, resumeContent } = req.body;

      // 2. Resumes 테이블에 이력서 생성
      const resume = await prisma.resumes.create({
        data: {
          UserId: +userId,
          resumeTitle,
          resumeContent,
        },
      });

      // 3. 이력서 생성 결과를 클라이언트에 반환
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESUMES.CREATE.SUCCEED,
        data: resume,
      });
    } catch (err) {
      next(err);
    }
  },
);

/** 이력서 목록 조회 API R-1 **/
resumesRouter.get("/", requireAccessToken, async (req, res, next) => {
  try {
    // 1. 필요한 정보 받아오기
    // 1-1. 로그인 정보로부터 user 정보 가져오기
    const { userId } = req.user;
    // 1-2. 쿼리스트링으로 sort(정렬) 정보 가져오기
    let { sort } = req.query;
    // 1-2-1. sort가 있으면 소문자화해라!
    sort = sort?.toLowerCase();
    // 1-2-2. sort가 없으면 기본값을 'desc'로!
    if (sort !== "desc" && sort !== "asc") {
      sort = "desc";
    }

    // 2. 이력서 조회하기 (정렬은 sort로!)
    const resumes = await prisma.resumes.findMany({
      select: {
        resumeId: true,
        User: {
          // 스키마에 정의한 Relation을 활용해 조회
          select: {
            UserInfos: {
              select: {
                name: true, // 작성자id 대신 이름을 조회
              },
              where: {
                UserId: +userId,
              },
            },
          },
        },
        resumeTitle: true,
        resumeContent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        UserId: +userId,
      },
      orderBy: {
        createdAt: sort,
      },
    });

    // 3. 결과를 예쁘게 수정
    let data = resumes;
    data = data.map((resume) => {
      return {
        resumeId: resume.resumeId,
        name: resume.User.UserInfos.name,
        resumeTitle: resume.resumeTitle,
        resumeContent: resume.resumeContent,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });

    // 4. 이력서 목록 조회 결과를 클라이언트에 반환
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data,
    });
  } catch (err) {
    next(err);
  }
});

/** 이력서 상세 조회 API R-2 **/
resumesRouter.get("/:resumeId", requireAccessToken, async (req, res, next) => {
  try {
    // 1. 필요한 정보 가져오기
    // 1-1. 로그인 정보로부터 user 정보 가져오기
    const { userId } = req.user;
    // 1-2. req.params로부터 resumeId 가져오기
    const { resumeId } = req.params;

    // 2. 해당 이력서 조회하기
    const resume = await prisma.resumes.findUnique({
      select: {
        resumeId: true,
        User: {
          // 스키마에 정의한 Relation을 활용해 조회
          select: {
            UserInfos: {
              select: {
                name: true, // 작성자id 대신 이름을 조회
              },
              where: {
                UserId: +userId,
              },
            },
          },
        },
        resumeTitle: true,
        resumeContent: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        UserId: +userId,
        resumeId: +resumeId,
      },
    });

    // 3. 이력서가 존재하지 않으면?
    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 3. 결과를 예쁘게 수정
    let data = {
      resumeId: resume.resumeId,
      name: resume.User.UserInfos.name,
      resumeTitle: resume.resumeTitle,
      resumeContent: resume.resumeContent,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };

    // 4. 이력서 상세 조회 결과를 클라이언트에 반환
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data,
    });
  } catch (err) {
    next(err);
  }
});

/** 이력서 수정 API U **/
resumesRouter.patch(
  "/:resumeId",
  requireAccessToken,
  updateResumeValidator,
  async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 resumeId 가져오기
      const { resumeId } = req.params;
      // 1-3. req.body로부터 수정할 내용 가져오기
      const { resumeTitle, resumeContent } = req.body;

      // 2. 해당 이력서 조회하기
      const resume = await prisma.resumes.findUnique({
        where: {
          UserId: +userId,
          resumeId: +resumeId,
        },
      });

      // 3. 이력서가 존재하지 않으면?
      if (!resume) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
        });
      }

      // 4. 이력서 수정하기
      const updatedResume = await prisma.resumes.update({
        data: {
          resumeTitle,
          resumeContent,
        },
        where: {
          UserId: +userId,
          resumeId: +resumeId,
        },
      });

      // 5. 이력서 수정 결과를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.SUCCEED,
        data: updatedResume,
      });
    } catch (err) {
      next(err);
    }
  },
);

/** 이력서 삭제 API D **/
resumesRouter.delete(
  "/:resumeId",
  requireAccessToken,
  async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 resumeId 가져오기
      const { resumeId } = req.params;

      // 2. 해당 이력서 조회하기
      const resume = await prisma.resumes.findUnique({
        where: {
          UserId: +userId,
          resumeId: +resumeId,
        },
      });

      // 3. 이력서가 존재하지 않으면?
      if (!resume) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
        });
      }

      // 4. 이력서 삭제하기
      const deletedResume = await prisma.resumes.delete({
        where: {
          UserId: +userId,
          resumeId: +resumeId,
        },
      });

      // 5. 이력서 삭제 결과를 클라이언트에게 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.DELETE.SUCCEED,
        data: {
          resumeId: deletedResume.resumeId,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

export { resumesRouter };
