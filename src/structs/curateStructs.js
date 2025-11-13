import * as s from 'superstruct';

// password: s.pattern(s.string(), PASSWORD_REGEX),
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
// helper(Rating: 큐레이팅 점수 유효성 검사),
const Rating = s.refine(
  s.number(),
  (value) => Number.isInteger(value) && value >= 0 && value <= 10,
  'Rating',
); //세번째 인자 레이팅은 에러 메세지용(디버깅할 때 좋음)
// helper(Integer = 1보다 큰 정수: 패치 및 삭제 id 유효성검사)
// 예: coerce를 이용해 문자열을 숫자로 변환한 후 refine 적용, 이제 문자열 "3"도 Number로 바뀌어 들어감
const CoercedNumber = s.coerce(s.number(), s.string(), (value) => Number(value));

const Integer = s.refine(CoercedNumber, (value) => Number.isInteger(value) && value > 0);

export const idStruct = s.object({
  id: Integer,
});

export const createCurateStruct = s.object({
  nickname: s.size(s.string(), 1, 20),
  content: s.size(s.string(), 1, 150),
  password: s.size(s.string(), 8, 16), //패스워드 수정 필요 (string 8 ~16) 정규식은 일단 주석 처리
  trendy: Rating,
  personality: Rating,
  practicality: Rating,
  costEffectiveness: Rating,
});
//put은 patch와 다르게 좀 더 엄격해서 rest관점에서 리소스 전체 교체를 의미 가능한 모든 필드를 클라이언트가 보내서 서버가 전체를 덮어쓰는 것을 기대함
export const putCurateStruct = s.assign(createCurateStruct, idStruct);

export const deleteCurateStruct = s.assign(
  s.partial(idStruct),
  s.object({ password: s.size(s.string(), 8, 16) }), //패스워드 수정 필요
);
