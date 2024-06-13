import { ResumesRepository } from "../repositories/resumes.repository.js";

export class ResumesService {
  resumesRepository = new ResumesRepository();

  /** 이력서 생성 C **/
  createResume = async (userId, resumeTitle, resumeContent) => {
    // 1-INPUT: resumesRepository.createResume()에 전달받은 매개변수 투입
    const createdResume = await this.resumesRepository.createResume(
      userId,
      resumeTitle,
      resumeContent,
    );
    // 1-OUTPUT: resumesRepository로부터 생성된 createdResume 정보 받음

    // 2. 받아온 createdResume 정보를 Controller에게 전달
    return createdResume;
  };

  /** 이력서 목록 조회 R-1 **/
  findAllResumes = async (userId, sort) => {
    // 1. 전달받은 매개변수 가공하기
    // 1-1. sort가 없으면 "desc" 기본값
    if (!sort) {
      sort = "desc";
    }
    // 1-2. sort가 있으면 소문자화
    else {
      sort = sort.toLowerCase();
    }

    // 2-INPUT: resumesRepository.findAllResumes()에 가공된 매개변수 투입
    let datas = await this.resumesRepository.findAllResumes(userId, sort);
    // 2-OUTPUT: datas에 resumesRepository로부터 조회된 resumes 정보 받음

    // 3. resumesRepository로부터 조회된 resumes 정보가 담긴 datas를 가공
    datas = datas.map((resume) => {
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

    // 4. 가공된 datas를 resumes에 담기
    const resumes = datas;

    // 5. 완성된 resumes 정보를 Controller에게 전달
    return resumes;
  };

  /** 이력서 상세 조회 R-2 **/
  findResumeById = async (userId, resumeId) => {
    // 1-INPUT: resumesRepository.findAllResumes()에 전달받은 매개변수 투입
    const data = await this.resumesRepository.findResumeById(userId, resumeId);
    // 1-OUTPUT: data에 resumesRepository로부터 조회된 resume 정보 받음

    // 2. 해당 이력서가 존재하지 않으면?
    if (!data) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 3. resumesRepository로부터 전달된 resume 정보가
    // 담긴 data를 가공하여 resume에 담기
    const resume = {
      resumeId: data.resumeId,
      name: data.User.UserInfos.name,
      resumeTitle: data.resumeTitle,
      resumeContent: data.resumeContent,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    // 4. 완성된 resume 정보를 Controller에게 전달
    return resume;
  };

  /** 이력서 수정 U **/
  updateResume = async (userId, resumeId, resumeTitle, resumeContent) => {
    // 1. 수정하려는 이력서가 존재하는지?
    // 1-1. 해당 이력서가 존재여부 resumesRepository에 물어보기
    const isExistingResume = await this.resumesRepository.findResumeById(
      userId,
      resumeId,
    );
    // 1-2. 이력서가 존재하지 않으면?
    if (!isExistingResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 2-INPUT: resumesRepository.updateResumes()에 전달받은 매개변수 투입
    const updatedResume = await this.resumesRepository.updateResume(
      userId,
      resumeId,
      resumeTitle,
      resumeContent,
    );
    // 2-OUTPUT: resumesRepository로부터 수정된 updatedResume 정보 받음

    // 3. 수정된 updatedResume 정보를 Controller에게 전달
    return updatedResume;
  };

  /** 이력서 삭제 D **/
  deleteResume = async (userId, resumeId) => {
    // 1. 삭제하려는 이력서가 존재하는지?
    // 1-1. 해당 이력서가 존재여부 resumesRepository에 물어보기
    const isExistingResume = await this.resumesRepository.findResumeById(
      userId,
      resumeId,
    );
    // 1-2. 이력서가 존재하지 않으면?
    if (!isExistingResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 2-INPUT: resumesRepository.deletedResume()에 전달받은 매개변수 투입
    const deletedResume = await this.resumesRepository.deleteResume(
      userId,
      resumeId,
    );
    // 2-OUTPUT: resumesRepository로부터 삭제된 deletedResume 정보 받음

    // 3. 삭제된 deletedResume 정보를 Controller에게 전달
    return deletedResume;
  };
}
