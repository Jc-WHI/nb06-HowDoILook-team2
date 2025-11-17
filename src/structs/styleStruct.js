import * as s from 'superstruct';

// 상품 목록 갤러리
// 재료 손질 Page
const pageStruct = s.coerce(s.number(), s.string(), (v) => {
  const n = Number(v);
  return Number.isNaN(n) || n < 1 ? 1 : n; // NaN이거나 1보다 작으면 1 반환
});

// 재료 손질 PageSize
const pageSizeStruct = s.coerce(s.number(), s.string(), (v) => {
  const n = Number(v);
  return Number.isNaN(n) || n < 1 ? 10 : n; // NaN이거나 1보다 작으면 10 반환
});

// 재료 손질 sortBy, searchBy, keyword, tag
const sortByStruct = s.optional(s.enums(['latest', 'mostViewed', 'mostCurated']));
const searchByStruct = s.optional(s.enums(['nickname', 'title', 'content', 'tag']));
const keywordStruct = s.optional(s.size(s.string(), 1, 50));
const tagStruct = s.optional(s.size(s.string(), 1, 20));

// 상품 목록 갤러리 완성
export const styleListGallaryQueryStruct = s.object({
  page: s.optional(pageStruct),
  pageSize: s.optional(pageSizeStruct),
  sortBy: sortByStruct,
  searchBy: searchByStruct,
  keyword: keywordStruct,
  tag: tagStruct,
});
