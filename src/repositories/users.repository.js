import { prisma } from "../utils/prisma.util.js";

export class UsersRepository {
  /** 유저 조회 **/
  findUserById = async (userId) => {
    // 1. 전달받은 매개변수를 활용하여 userInfo 조회
    const user = await prisma.users.findUnique({
      where: { userId: +userId },
    });
    // 2. 조회된 user를 반환
    return user;
  };

  /** 유저 정보 조회 **/
  findUserInfoById = async (userId) => {
    // 1. 전달받은 매개변수를 활용하여 userInfo 조회
    const userInfo = await prisma.userInfos.findUnique({
      where: { UserId: +userId },
    });
    // 2. 조회된 userInfo를 usersService로 전달
    return userInfo;
  };
}
