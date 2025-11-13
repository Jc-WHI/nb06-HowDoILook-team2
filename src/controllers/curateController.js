import { create } from 'superstruct';
import { createCurateStruct, idStruct } from '../structs/curateStructs';
import NotFoundError from '../lib/error.js';
import { prisma } from '../lib/prismaClient.js';
//req.params: 리소스 위치
//req.query: 필터링 / 페이지네이션
//req.body: 보내는 실제 데이터
export async function createCurating(req, res) {
  //'style/:styleId' 라우트 경로 설정
  const { styleId } = create(req.params, idStruct);
  const payload = create(req.body, createCurateStruct);
  // 스타일 존재 확인
  const findStyle = await prisma.style.findUnique({ where: { id: styleId } });
  if (!findStyle) {
    throw new NotFoundError('style', styleId);
  }
  const created = await prisma.curating.create({
    data: {
      nickname: payload.nickname,
      content: payload.content,
      password: payload.password,
      trendy: payload.trendy ?? 0, //입력 안정성 보장 클라이언트가 안보냈을 때 undefined를 0으로 보정, 명시적 의도표현으로 이필드는 0이 기본값이다라는 것이 드러남
      personality: payload.personality ?? 0,
      practicality: payload.practicality ?? 0,
      costEffectiveness: payload.costEffectiveness ?? 0,
      style: {
        connect: { id: styleId },
      },
    },
    select: {
      id: true,
      nickname: true,
      content: true,
      trendy: true,
      personality: true,
      practicality: true,
      costEffectiveness: true,
      createdAt: true,
      // 반환할 필드만 나열 (style, styleId 제외)
    },
  });
  return res.status(201).json(created);
}
