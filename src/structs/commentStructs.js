import * as s from 'superstruct';

// 비밀번호 정규식 (영문, 숫자 조합 8~16자)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;

// helper(Integer = 1보다 큰 정수: 패치 및 삭제 id 유효성검사)
// 예: coerce를 이용해 문자열을 숫자로 변환한 후 refine 적용, 이제 문자열 "3"도 Number로 바뀌어 들어감
const CoercedNumber = s.coerce(s.number(), s.string(), (value) => Number(value));

const Integer = s.refine(CoercedNumber, (value) => Number.isInteger(value) && value > 0);

//========== Comment Structs ==========

//id 검사
export const idStruct = s.object({
  id: Integer,
});

//curationId 검사
export const curationIdStruct = s.object({
  curationId: Integer,
});

//코멘트 생성 필드 검사 (content,password)
export const createCommentStruct = s.object({
  //content, password
  content: s.size(s.string(), 1, 150),
  password: s.pattern(s.string(), PASSWORD_REGEX),
});

//코멘트 재생성(수정) 검사 (content,password)
export const putCommentStruct = s.assign(createCommentStruct);

//코멘트 삭제 검사 (password)
export const deleteCommentStruct = s.object({
  password: s.pattern(s.string(), PASSWORD_REGEX),
});
