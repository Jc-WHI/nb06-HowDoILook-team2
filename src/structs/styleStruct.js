import * as s from 'superstruct';

// style id 검사
const integer = s.refine(
  s.coerce(s.number(), s.string(), (v) => Number(v)),
  'positiveInteger',
  (v) => Number.isInteger(v) && v >= 0,
);

export const styleIdStruct = s.object({
  styleId: integer,
});
