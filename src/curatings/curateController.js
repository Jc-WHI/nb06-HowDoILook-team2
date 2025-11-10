import { PrismaClient } from '@prisma/client';
import { create } from 'superstruct';
import { createCurateStruct, idStruct } from './curateStructs';
import NotFoundError from './error';

const prisma = new PrismaClient();

export async function createCurating(req, res) {
  const { id: styleId } = create(req.params, idStruct);
  const { data: payload } = create(req.body, createCurateStruct);
  // 스타일 존재 확인
  const findStyle = await prisma.style.findUnique({ where: { id: styleId } });
  if (!findStyle) {
    throw new NotFoundError('style', styleId);
  }
  const created = await prisma.curating.create({
    data: {
      data: payload, // JSON 칼럼으로 저장
      style: { connect: { id: styleId } },
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
