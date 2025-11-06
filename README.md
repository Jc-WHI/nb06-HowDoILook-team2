<<<<<<< HEAD
# nb06-HowDoILook-team2

초급 프로젝트
1
=======
##Team2 

[팀협업문서](https://docs.google.com/document/d/1AwnkF5-XPsYG2BurkfwQ4vCrD1MtuhTw7PKbT6TpYSg/edit?tab=t.vki1uwaoidpf)

### 팀원 구성

- 오윤 (http://)
- 제이든 (개인 Github 링크)
- 마크 (개인 Github 링크)
- 데이지 (개인 Github 링크)
- 제이 (개인 Github 링크)

---

### 프로젝트 소개

- 스타일 공유 및 큐레이팅 서비스 백엔드 서버
- 프로젝트 기간: 2025.10.31 ~ 2025.11.20

---

### 기술 스택

- Backend: Express.js, PrismaORM
- Database: Progres
- 공통 Tool: Git & Github, Discord

### 팀원별 구현 기능 상세

#### 웨인

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- 소셜 로그인 API
    - 구글 소셜 로그인 API를 활용하여 소셜 로그인 기능을 구현
    - 로그인 후 추가 정보 입력을 위한 API 엔드포인트 개발
- 회원 추가 정보 입력 API
    - 회원 유형(관리자, 학생)에 따른 조건부 입력 처리 API 구현

#### 오윤

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

-

---

### 파일 구조

```
src
 ┣ config
 ┃ ┗ db.ts
 ┣ controllers
 ┃ ┣ auth.controller.ts
 ┃ ┗ user.controller.ts
 ┣ middleware
 ┃ ┣ auth.middleware.ts
 ┃ ┗ error.middleware.ts
 ┣ models
 ┃ ┣ user.model.ts
 ┃ ┗ course.model.ts
 ┣ routes
 ┃ ┣ auth.routes.ts
 ┃ ┗ user.routes.ts
 ┣ services
 ┃ ┣ auth.service.ts
 ┃ ┗ user.service.ts
 ┣ utils
 ┃ ┣ jwt.ts
 ┃ ┣ constants.ts
 ┃ ┗ logger.ts
 ┣ app.ts
 ┗ server.ts
prisma
 ┣ schema.prisma
 ┗ seed.ts
.env
.gitignore
package.json
tsconfig.json
README.md
```

---

### 구현 홈페이지

(개발한 홈페이지에 대한 링크 게시)

https://www.codeit.kr/

---

### 프로젝트 회고록

(제작한 발표자료 링크 혹은 첨부파일 첨부)
>>>>>>> c3e2790 (프런트앤드 오류수정)
