import { prisma } from "../utils/prisma.util.js";

export class AuthRepository {
  /** 가입여부 확인 **/
  findByEmail = async (email) => {
    // 1. 전달받은 매개변수로 회원가입 여부 조회
    const isExistingEmail = await prisma.users.findUnique({
      where: { email },
    });
    // 2. 조회된 user 정보를 authService로 전달
    return isExistingEmail;
  };

  /** 회원가입 **/
  signUp = async (email, hashedPassword, name) => {
    // 1. 전달받은 매개변수로 users 테이블에 데이터 생성
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    // 2. 전달받은 매개변수로 user_infos 테이블에도 데이터 생성
    const userInfo = await prisma.userInfos.create({
      data: {
        UserId: user.userId,
        email,
        name,
      },
    });
    return userInfo;
  };
}
