import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  authService = new AuthService();

  /** 회원가입 **/
  signUp = async (req, res, next) => {
    try {
      // 1. 필요한 정보를 가져오기
      const { email, password, name } = req.body;

      // 2-INPUT: authService.signUp()에 매개변수로 위 정보들 투입!
      const signUpUserInfo = await this.authService.signUp(
        email,
        password,
        name,
      );
      // 2-OUTPUT: authService로부터 넘어온 signUpUserInfo 정보 받음!

      // 3. 회원가입 결과를 클라이언트에 반환
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: signUpUserInfo,
      });
    } catch (err) {
      next(err);
    }
  };

  /** 로그인 **/
  logIn = async (req, res, next) => {
    try {
      // 1. 필요한 정보 가져오기
      // 1-1. req.body에서 입력받은 정보 가져오기
      const { email, password } = req.body;

      // 2-INPUT: authService.logIn()에 매개변수로 위 정보들 투입!
      const accessToken = await this.authService.logIn(email, password);
      // 2-OUTPUT: authService로부터 넘어온 accessToken 정보 받음!

      // 3. 로그인 결과를 클라이언트에 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.LOG_IN.SUCCEED,
        data: {
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
