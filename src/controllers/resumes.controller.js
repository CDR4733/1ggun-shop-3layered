import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { ResumesService } from "../services/resumes.service.js";

export class ResumesController {
  resumesService = new ResumesService();

  /** 이력서 생성 C **/
  createResume = async (req, res, next) => {
    try {
      // 1. 필요한 정보 받아오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.body에 입력된 데이터들 가져오기
      const { resumeTitle, resumeContent } = req.body;

      // 2-INPUT: resumesService.createResume()에 매개변수로 위 정보들 투입!
      const createdResume = await this.resumesService.createResume(
        userId,
        resumeTitle,
        resumeContent,
      );
      // 2-OUTPUT: resumesService로부터 넘어온 createdResume 정보 받음

      // 3. 받아온 createdResume 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RESUMES.CREATE.SUCCEED,
        data: createdResume,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 목록 조회 R-1 **/
  getResumes = async (req, res, next) => {
    try {
      // 1. 필요한 정보 받아오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. 쿼리스트링으로 sort(정렬) 정보 가져오기
      let { sort } = req.query;

      // 2-INPUT: resumesService.findAllResumes()에 매개변수로 위 정보들 투입!
      const resumes = await this.resumesService.findAllResumes(userId, sort);
      // 2-OUTPUT: resumesService로부터 넘어온 resumes 정보 받음

      // 3. 받아온 resumes 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
        data: resumes,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 상세 조회 R-2 **/
  getResumeById = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 resumeId 가져오기
      const { resumeId } = req.params;

      // 2-INPUT: resumesService.findResumeById()에 매개변수로 위 정보들 투입!
      const resume = await this.resumesService.findResumeById(userId, resumeId);
      // 2-OUTPUT: resumesService로부터 넘어온 resume 정보 받음

      // 3. 받아온 resume 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
        data: resume,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 수정 U **/
  updateResume = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 resumeId 가져오기
      const { resumeId } = req.params;
      // 1-3. req.body로부터 수정할 내용 가져오기
      const { resumeTitle, resumeContent } = req.body;

      // 2-INPUT: resumesService.updateResume()에 매개변수로 위 정보들 투입!
      const updatedResume = await this.resumesService.updateResume(
        userId,
        resumeId,
        resumeTitle,
        resumeContent,
      );
      // 2-OUTPUT: resumesService로부터 넘어온 updatedResume 정보 받음

      // 3. 받아온 updatedResume 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.UPDATE.SUCCEED,
        data: updatedResume,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 이력서 삭제 D **/
  deleteResume = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;
      // 1-2. req.params로부터 resumeId 가져오기
      const { resumeId } = req.params;

      // 2-INPUT: resumesService.deleteResume()에 매개변수로 위 정보들 투입!
      const deletedResume = await this.resumesService.deleteResume(
        userId,
        resumeId,
      );
      // 2-OUTPUT: resumesService로부터 넘어온 deleteResume 정보 받음

      // 3. 받아온 deleteResume 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RESUMES.DELETE.SUCCEED,
        data: deletedResume.resumeId,
      });
    } catch (err) {
      next(err);
    }
  };
}
