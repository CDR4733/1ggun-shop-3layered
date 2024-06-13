import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET_KEY } from "../constants/env.constant.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import {
  HASH_SALT_ROUNDS,
  ACCESS_TOKEN_EXPIRES_IN,
} from "../constants/auth.constant.js";
import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

export class AuthService {
  authRepository = new AuthRepository();

  /** 회원가입 **/
  signUp = async (email, password, name) => {
    // 1. 이미 가입된 이메일인지?
    // 1-1. 해당 이메일이 DB에 있는지 확인
    const isExistingEmail = await this.authRepository.findByEmail(email);
    // 1-2. 이미 가입된 이메일이라면 에러
    if (isExistingEmail) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }
    // 2. 비밀번호 hash하기
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    // 3-INPUT: authRepository.signUp()에 전달받은 매개변수 투입
    const signUpUserInfo = await this.authRepository.signUp(
      email,
      hashedPassword,
      name,
    );
    // 3-OUTPUT: authRepository로부터 생성된 signUpUserInfo 정보 받음

    // 4. 가입된 회원정보를 Controller에게 전달
    return signUpUserInfo;
  };

  /** 로그인 **/
  logIn = async (email, password) => {
    // 1. 해당 이메일로 가입된 사람이 있는가?
    // 1-1. 해당 이메일로 가입된 user를 찾는다
    const user = await this.authRepository.findByEmail(email);
    // 1-2. 가입된 게 아니라면 에러
    if (!user) {
      throw new HttpError.NotFound(MESSAGES.AUTH.COMMON.EMAIL.NOT_FOUND);
    }

    // 2. 만약 해당 user가 존재한다면 비밀번호가 일치하는지 검사
    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    // 2-1. 비밀번호가 일치하지 않는다면 에러
    if (!isPasswordMatched) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.LOG_IN.UNAUTHORIZED);
    }

    // 3. AccessToken 발행
    const payload = { userId: user.userId };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }); // payload, 비밀키, 옵션(만료기간 등) 순으로 입력가능

    // 4. AccessToken을 Controller로 전달
    return accessToken;
  };
}
