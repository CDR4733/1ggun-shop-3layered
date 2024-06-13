import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { UsersService } from "../services/users.service.js";

export class UsersController {
  usersService = new UsersService();

  /** 내 정보 조회 **/
  getMyInfo = async (req, res, next) => {
    try {
      // 1. 필요한 정보 받아오기
      // 1-1. 로그인 정보로부터 user 정보 가져오기
      const { userId } = req.user;

      // 2-INPUT: usersService.getMyInfo()에 매개변수로 위 정보들 투입!
      const myInfo = await this.usersService.getMyInfo(userId);
      // 2-OUTPUT: usersService로부터 넘어온 userInfo 정보 받음

      // 3. 받아온 myInfo 정보를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_ME.SUCCEED,
        data: myInfo,
      });
    } catch (err) {
      next(err);
    }
  };
}
