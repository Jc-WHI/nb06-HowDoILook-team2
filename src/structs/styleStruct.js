import * as s from 'superstruct';

const categoryStruct = s.enums(['top', 'bottom', 'outer', 'dress', 'shoes', 'bag', 'accessory']);

const itemStruct = s.object({
  name: s.size(s.nonempty(s.string()), 1, 20),
  brand: s.size(s.nonempty(s.string()), 1, 20),
  price: s.min(s.number(), 0),
});

const categoriesStruct = s.record(categoryStruct, itemStruct);

// 상품 등록
export const createStyleBodyStruct = s.object({
  nickname: s.size(s.nonempty(s.string()), 1, 20),
  title: s.coerce(s.size(s.nonempty(s.string()), 1, 20), s.string(), (v) => v.trim()),
  content: s.size(s.nonempty(s.string()), 1, 500),
  password: s.size(s.nonempty(s.string()), 8, 16),
  categories: categoriesStruct,
  tags: s.array(s.size(s.nonempty(s.string()), 1, 10)),
  imageUrls: s.array(s.nonempty(s.string())),
});

// 상품 수정
export const updateStyleBodyStruct = s.object({
  nickname: s.size(s.nonempty(s.string()), 1, 20),
  title: s.coerce(s.size(s.nonempty(s.string()), 1, 20), s.string(), (v) => v.trim()),
  content: s.size(s.nonempty(s.string()), 1, 500),
  password: s.size(s.nonempty(s.string()), 8, 16),
  categories: categoriesStruct,
  tags: s.optional(s.array(s.size(s.nonempty(s.string()), 1, 10))),
  imageUrls: s.array(s.nonempty(s.string())),
});

// style id 검사
const integer = s.refine(
  s.coerce(s.number(), s.string(), (v) => Number(v)),
  'positiveInteger',
  (v) => Number.isInteger(v) && v >= 0,
);

export const styleIdStruct = s.object({
  styleId: integer,
});

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

// 상품 목록 랭크
// 재료 손질 rankBy
const rankByStruct = s.optional(
  s.enums(['total', 'trendy', 'personality', 'practicality', 'costEffectiveness']),
);

// 상품 목록 랭크 완성
export const styleListRankQueryStruct = s.object({
  page: s.optional(pageStruct),
  pageSize: s.optional(pageSizeStruct),
  rankBy: s.optional(rankByStruct),
});

// 상품 제거
export const styleDeleteStruct = s.object({
  password: s.size(s.nonempty(s.string()), 8, 16),
});
