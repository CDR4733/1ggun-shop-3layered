export const HTTP_STATUS = {
  OK: 200, // 호출에 성공
  CREATED: 201, // 생성에 성공
  BAD_REQUEST: 400, // 잘못된 요청 (예시: 입력값 누락)
  UNAUTHORIZED: 401, // 인증 실패 (예시: 비밀번호 틀림)
  FORBIDDEN: 403, // 인가 실패 (예시: 접근권한이 없을 때)
  NOT_FOUND: 404, // 리소스 부재 (예시: 이미 삭제된 게시글일 때)
  CONFLICT: 409, // 충돌 발생 (예시: 이메일 중복)
  INTERNAL_SERVER_ERROR: 500, // 내부 서버 에러 (예상치 못한 에러)
};
