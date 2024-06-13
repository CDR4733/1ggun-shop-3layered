import { UsersRepository } from "../repositories/users.repository.js";

export class UsersService {
  usersRepository = new UsersRepository();

  /** 내 정보 조회 **/
  getMyInfo = async (userId) => {
    // 1-INPUT: usersRepository.findUserInfoById()에 전달받은 매개변수 투입
    const myInfo = await this.usersRepository.findUserInfoById(userId);
    // 1-OUTPUT: usersRepository로부터 조회된 userInfo 정보 받음

    // 2. 전달받은 정보를 가공하여 Controller에게 전달
    myInfo.userInfoId = undefined;
    return myInfo;
  };
}
