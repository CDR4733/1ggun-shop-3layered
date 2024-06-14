# 1ggun-shop 일꾼샵-3layered

## 🍑 1ggun-shop 일꾼샵-3layered
- 간단 구인구직 리크루팅 플랫폼 입니다.
- 이력서 CRUD와 채용 관련 의사결정 표시를 지원합니다.
- 기존 1ggun-shop에서 3layered 리팩토링을 했습니다.

## 🍒 간단 기능 소개
- 취업을 준비하는 회원들이 여러 이력서를 자유롭게 제출할 수 있습니다.
- 이때 제출된 이력서는 언제든지 수정 및 삭제가 가능합니다.
- 타인이 제출한 이력서는 열람, 수정 및 삭제가 불가능합니다.
- 단, 채용 담당자 자격을 부여받은 회원들은 제출된 모든 이력서를 열람할 수 있습니다.
- 마음에 드는 이력서에 채용 관련 의사결정을 표시할 수 있습니다.

## 🍋 실행 방법

- 필요한 패키지 설치

```sh
yarn
```

- 서버 실행 (배포용)

```sh
yarn start
```

- 서버 실행 (개발용)

```sh
yarn dev
```

- 서버 체크

```sh
http://cdr4733.shop:3000/server-check
```
![image](https://github.com/CDR4733/1ggun-shop-3layered/assets/166963977/e5ce9fe5-2fc1-454a-98b6-0ed97b7be5de)



## 🍓 API Specification

![00-API명세](https://github.com/CDR4733/1ggun-shop/assets/166963977/4246cff9-4288-4f93-b7b1-e0689349ba58)


⛱️ API명세서 Link: https://shocking-flavor-85b.notion.site/API-e2ad44c6fa1e41e7a776e310f44b8d37


## 🥕 Entity Relationship Diagram

![00-ERD_DrawSQL](https://github.com/CDR4733/1ggun-shop/assets/166963977/4f0f435a-b2dc-47e5-879d-e735c27c5a54)


⛱️ EDR설계도 Link: https://shocking-flavor-85b.notion.site/ERD-a7cf7877702e4488a139508d3c6e1f5f?pvs=4


## 🍉 API Test

![03-API테스트](https://github.com/CDR4733/1ggun-shop/assets/166963977/ddcff004-af7a-4565-acad-995f9b454906)


⛱️ API테스트결과 Link: https://shocking-flavor-85b.notion.site/API-b13028621ca94525bb1e79e1b5730335?pvs=4

## 🍒 Folder Structures

```sh
📦1ggun-shop-3layered    
 ┣ 📂prisma   
 ┃ ┗ 📜schema.prisma   
 ┣ 📂src   
 ┃ ┣ 📂constants   
 ┃ ┃ ┣ 📜auth.constant.js   
 ┃ ┃ ┣ 📜env.constant.js   
 ┃ ┃ ┣ 📜http-status.constant.js   
 ┃ ┃ ┣ 📜message.constant.js   
 ┃ ┃ ┗ 📜resume.constant.js   
 ┃ ┣ 📂controllers   
 ┃ ┃ ┣ 📜auth.controller.js   
 ┃ ┃ ┣ 📜resumes.controller.js   
 ┃ ┃ ┗ 📜users.controller.js   
 ┃ ┣ 📂errors   
 ┃ ┃ ┗ 📜http.error.js   
 ┃ ┣ 📂middlewares   
 ┃ ┃ ┣ 📂validators   
 ┃ ┃ ┃ ┣ 📜create-resume-validator.middleware.js   
 ┃ ┃ ┃ ┣ 📜log-in-validator.middleware.js   
 ┃ ┃ ┃ ┣ 📜sign-up-validator.middleware.js   
 ┃ ┃ ┃ ┗ 📜update-resume-validator.middleware.js   
 ┃ ┃ ┣ 📜error-handler.middleware.js   
 ┃ ┃ ┗ 📜require-access-token.middleware.js   
 ┃ ┣ 📂repositories   
 ┃ ┃ ┣ 📜auth.repository.js   
 ┃ ┃ ┣ 📜resumes.repository.js   
 ┃ ┃ ┗ 📜users.repository.js   
 ┃ ┣ 📂routers   
 ┃ ┃ ┣ 📜auth.router.js   
 ┃ ┃ ┣ 📜index.js   
 ┃ ┃ ┣ 📜resumes.router.js   
 ┃ ┃ ┗ 📜users.router.js   
 ┃ ┣ 📂services   
 ┃ ┃ ┣ 📜auth.service.js   
 ┃ ┃ ┣ 📜resumes.service.js   
 ┃ ┃ ┗ 📜users.service.js   
 ┃ ┣ 📂utils   
 ┃ ┃ ┗ 📜prisma.util.js   
 ┃ ┗ 📜app.js   
 ┣ 📜.env   
 ┣ 📜.gitignore   
 ┣ 📜.prettierrc.json   
 ┣ 📜eslint.config.js   
 ┣ 📜package.json   
 ┣ 📜README.md   
 ┗ 📜yarn.lock   
```

## 🍌 배포
- AWS EC2 & RDS
- ⛱️ 배포링크 : http://cdr4733.shop:3000/

🍊🍋🍎🥭🍍🍑🍏🍒🍌

