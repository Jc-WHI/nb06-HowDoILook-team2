### Team2

[팀협업문서](https://docs.google.com/document/d/1AwnkF5-XPsYG2BurkfwQ4vCrD1MtuhTw7PKbT6TpYSg/edit?tab=t.vki1uwaoidpf)

### 팀원 구성

- 조치호[팀장] (https://github.com/Jc-WHI)
- 오윤 (https://github.com/xoxo-oy)
- 최민수 (https://github.com/chamysj)
- 김유미 (https://github.com/kyoumi3263-hue)
- 이현우(https://github.com/DremingLeopard74)

---

### 프로젝트 소개

- 스타일 공유 및 큐레이팅 서비스 플랫폼
- 프로젝트 기간: 2025.10.31 ~ 2025.11.20

---

### 기술 스택

- Backend: Express.js, PrismaORM
- Database: Progres
- 공통 Tool: Git & Github, Discord, Google Docs

### 팀원별 구현 기능 상세

#### 오윤

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

#### 조치호

#### 최민수

#### 김유미

(11.06) 큐레이팅 답글 등록 (POST)

(설명) 큐레이팅에 게시글 작성자(스타일 등록자)가 답글을 등록합니다.
(URL) POST /curations/{curationId}/comments

(Request Body)
JSON
{
"content": "string",
"password": "int"
}

(Success Response - 201 Created)
JSON
{
"id": 1,
"nickname": "작성자닉네임",
"content": "답글 내용",
"createdAt": "2025-11-07T..."
}

#### 이현우

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
