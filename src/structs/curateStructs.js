import * as s from 'superstruct';

// password: s.pattern(s.string(), PASSWORD_REGEX),
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
// helper(Rating: 큐레이팅 점수 유효성 검사),
const Rating = s.refine(
  s.number(),
  'Rating',
  (value) => Number.isInteger(value) && value >= 0 && value <= 10,
); //버전 패치로 인해 v2에서는 변수이름이 두번째로 오게됨)
// helper(Integer = 1보다 큰 정수: 패치 및 삭제 id 유효성검사)
// 예: coerce(입력값 변환해서 원하는 타입 맞추기) (희망하는 바꿀 형태 스트럭트 - 숫자가 되길 바람, 바꾸고싶은 스트럭트 - 여기선 문자, (값)=> 변환결과)
// 이용해 문자열을 숫자로 변환한 후 refine 적용, 이제 문자열 "3"도 Number로 바뀌어 들어감
const CoercedNumber = s.coerce(s.number(), s.union([s.string(), s.number()]), (value) =>
  Number(value),
);
//refine 추가규칙 붙이기
const Integer = s.refine(CoercedNumber, 'Integer', (value) => Number.isInteger(value) && value > 0);

//id스트럭트는 개발자들을 위한 밸리데이션 = 백앤드: DB에 잘못된 값이 들어가는 것을 절대 방지하는 안전 장치, 프론트: 잘못된 요청을 미리 막아주는 역할
export const styleIdStruct = s.object({
  styleId: Integer,
});

export const curationIdStruct = s.object({
  curationId: Integer,
});

export const createCurateStruct = s.object({
  nickname: s.size(s.string(), 1, 20),
  content: s.size(s.string(), 1, 150),
  password: s.size(s.string(), 8, 16), //패스워드 수정 필요 (string 8 ~16) 정규식은 일단 주석 처리
  trendy: s.optional(Rating), //스키마에서 디폴트가 0이라 서버에서 0으로 깔아도 되는 필드이기때문에 optional설정
  personality: s.optional(Rating), //undefined를 허용, ->디폴트 값 0으로 반환하게 됨 값이 없으면 패스 있으면 rating규칙 검사
  practicality: s.optional(Rating),
  costEffectiveness: s.optional(Rating),
});

export const deleteCurateStruct = s.object({ password: s.size(s.string(), 8, 16) });

const Page = s.refine(Integer, 'Page', (value) => value <= 500);
const PageSize = s.refine(Integer, 'PageSize', (value) => value <= 20);

export const pageParamsStruct = s.object({
  page: s.defaulted(Page, 1),
  pageSize: s.defaulted(PageSize, 5),
  searchBy: s.optional(s.enums(['nickname', 'content'])), //키워드 값을 주지 않아도 목록이 검색되게
  keyword: s.optional(s.string()),
});

//put은 patch와 다르게 좀 더 엄격해서 rest관점에서 리소스 전체 교체를 의미 가능한 모든 필드를 클라이언트가 보내서 서버가 전체를 덮어쓰는 것을 기대함
export const updateCurateStruct = s.object({
  nickname: s.optional(s.size(s.string(), 1, 20)),
  content: s.optional(s.size(s.string(), 1, 150)),
  password: s.size(s.string(), 8, 16),
  trendy: s.optional(s.nullable(Rating)),
  personality: s.optional(s.nullable(Rating)),
  practicality: s.optional(s.nullable(Rating)),
  costEffectiveness: s.optional(s.nullable(Rating)),
});
