import { prisma } from "../utils/prisma.util.js";

export class ResumesRepository {
  /** 이력서 생성 C **/
  createResume = async (userId, resumeTitle, resumeContent) => {
    // 1. 전달받은 매개변수를 활용하여 이력서 생성
    const createdResume = await prisma.resumes.create({
      data: {
        UserId: +userId,
        resumeTitle,
        resumeContent,
      },
    });
    // 2. 생성된 createdResume 정보를 resumesService로 전달
    return createdResume;
  };

  /** 이력서 목록 조회 R-1 **/
  findAllResumes = async (userId, sort) => {
    // 1. 전달받은 매개변수를 활용하여 이력서 목록 조회
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
    // 2. 조회된 resumes 정보를 resumesService로 전달
    return resumes;
  };

  /** 이력서 상세 조회 R-2 **/
  findResumeById = async (userId, resumeId) => {
    // 1. 전달받은 매개변수를 활용하여 이력서 상세 조회
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
    //2. 조회된 resume 정보를 resumesService로 전달
    return resume;
  };

  /** 이력서 수정 U **/
  updateResume = async (userId, resumeId, resumeTitle, resumeContent) => {
    // 1. 전달받은 매개변수를 바탕으로 이력서 수정
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
    // 2. 수정된 updatedResume 정보를 resumesService로 전달
    return updatedResume;
  };

  /** 이력서 삭제 D **/
  deleteResume = async (userId, resumeId) => {
    // 1. 전달받은 매개변수를 바탕으로 이력서 삭제
    const deletedResume = await prisma.resumes.delete({
      where: {
        UserId: +userId,
        resumeId: +resumeId,
      },
    });
    // 2. 삭제된 deletedResume 정보를 resumesService로 전달
    return deletedResume;
  };
}
