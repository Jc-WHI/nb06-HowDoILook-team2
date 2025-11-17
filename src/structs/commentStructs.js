import * as s from 'superstruct';

// 비밀번호 정규식 (영문, 숫자 조합 8~16자)
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
// s.string(), 8, 16 사용하기로

//Integer = 1보다 큰 정수: 패치 및 삭제 id 유효성 검사)
//예: Coerce를 이용해 문자열을 숫자로 변환한 후 refine적용, 이제 문자열 "3"도 Number 으로 바뀌어 들어감
const CoercedNumber = s.coerce(s.number(), s.union([s.string(), s.number()]), (value) =>
  Number(value),
);

const Integer = s.refine(CoercedNumber, 'Integer', (value) => Number.isInteger(value) && value > 0);

//========== Comment Structs ==========

//id 검사
export const commentIdStruct = s.object({
  commentId: Integer,
});

//curationId 검사
export const curationIdStruct = s.object({
  curationId: Integer,
});

//답글 생성 필드 검사 (content, password)
export const createCommentStruct = s.object({
  content: s.size(s.string(), 1, 150),
  password: s.size(s.string(), 8, 16),
});

//답글 재생성(수정) 필드 검사 (content, password)
export const putCommentStruct = s.assign(createCommentStruct);

//답글 삭제 필드 검사 (password)
export const deleteCommentStruct = s.object({
  password: s.size(s.string(), 8, 16),
});
