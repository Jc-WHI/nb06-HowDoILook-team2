### Team2

[팀협업문서\_Google Docs](https://docs.google.com/document/d/1AwnkF5-XPsYG2BurkfwQ4vCrD1MtuhTw7PKbT6TpYSg/edit?tab=t.vki1uwaoidpf)

---

### 팀원 구성 (깃허브 주소)

- [조치호(팀장)](https://github.com/Jc-WHI)
- [오윤](https://github.com/xoxo-oy)
- [최민수](https://github.com/chamysj)
- [김유미](https://github.com/kyoumi3263-hue)
- [이현우](https://github.com/DremingLeopard74)

---

### 프로젝트 소개

- 스타일 공유 및 큐레이팅 서비스 플랫폼
- 프로젝트 기간: 2025.10.31 ~ 2025.11.20

---

<br>

## 🛠️ 기술 스택 (Tech Stack)

| 구분             | 항목       | 상세 내용            |
| :--------------- | :--------- | :------------------- |
| **백엔드**       | 프레임워크 | Express.js           |
| **백엔드**       | ORM        | Prisma ORM           |
| **데이터베이스** | RDB        | PostgreSQL           |
| **공통 도구**    | 버전 관리  | Git & GitHub         |
| **공통 도구**    | 소통/협업  | Discord, Google Docs |

---

<br><br>

### 팀원별 구현 기능 상세

|  이름  | 역할 | 담당 업무                                                                                                  |
| :----: | :--: | :--------------------------------------------------------------------------------------------------------- |
| 조치호 | 팀장 | 스타일 API (등록/삭제) 개발, <br> 구현 영상 담당                                                           |
| 오 윤  | 팀원 | 스타일 API (수정, 갤러리/랭킹 목록 조회, 상세 조회) 개발 <br> 코드 테스트                                  |
| 최민수 | 팀원 | 큐레이팅 기능 (등록, 조회, 수정, 삭제) 개발 <br> Superstruct 활용 유효성 검사 코드 작성 및 적용<br> 문서화 |
| 김유미 | 팀원 | 답글 기능(등록, 수정, 삭제) 개발<br> 문서화                                                                |
| 이현우 | 팀원 | Image API, 인기 Tag 기능 개발 구현<br>                                                                     |

<br>

---

```
[파일 구조]

 nb06-HowDoILook-team2


 prisma/
 ┃ ┣ migrations/
 ┃ ┣ mock.js
 ┃ ┣ schema.prisma
 ┃ ┗ seed.js
 src
 ┣ controllers/
 ┃ ┣ commentController.js
 ┃ ┣ curateController.js
 ┃ ┣ errorController.js
 ┃ ┣ imageController.js
 ┃ ┣ styleController.js
 ┃ ┗ tagController.js
 ┣ lib/
 ┃ ┣ constants.js
 ┃ ┣ error.js
 ┃ ┣ prismaClient.js
 ┃ ┗ withAsync.js
 ┣ routers/
 ┃ ┣ commentRouter.js
 ┃ ┣ curateRouter.js
 ┃ ┣ imageRouter.js
 ┃ ┣ styleRouter.js
 ┃ ┗ tagsRouter.js
 ┣ structs/
 ┃ ┣ commentStruct.js
 ┃ ┣ curateStruct.js
 ┃ ┗ styleStruct.js
 ┣ server.js
 ┗ upload.js
 .env
 .gitignore
 .prettierrc
 package.json
 package-lock.json
 README.md
```

---

### 구현 홈페이지

[HowDoILook 홈페이지 (2팀)](http://220.93.220.93:3000/)

---

### 프로젝트 회고록

[구글독스](https://docs.google.com/document/d/1AwnkF5-XPsYG2BurkfwQ4vCrD1MtuhTw7PKbT6TpYSg/edit?tab=t.0)<br>
[프로젝트 계획서](https://www.notion.so/2b0f00b64bdd8072b42de39918295b56)
