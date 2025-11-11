import { create } from 'superstruct';
import { createCurateStruct, idStruct, putCurateStruct } from '../structs/curateStructs';
import NotFoundError from '../lib/error.js';
import { prisma } from '../lib/prismaClient.js';

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

//-----------------------------------------------------
export async function putCurating(req, res) {
  // 1) params/body 검증
  const { id: curationId } = create(req.params, idStruct);
  const body = create(req.body, putCurateStruct); // putCurateStruct가 { password?, ...fields } 형태라 가정

  // 2) body 분해: password는 인증용, 나머지는 업데이트 페이로드
  const { password, ...payload } = body;

  // 3) 대상 큐레이션 조회 (한 번만)
  const existing = await prisma.curating.findUnique({
    where: { id: curationId },
    select: { id: true, password: true }, // styleId 등은 이 경로에서는 불필요하므로 제외
  });
  if (!existing) throw new NotFoundError('curating', curationId);

  // 4) 비밀번호 인증 (필수라면)
  if (!password) throw new UnauthorizedError('비밀번호가 필요합니다.');
  const matched = await bcrypt.compare(String(password), existing.password ?? '');
  if (!matched) throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');

  // 5) payload에서 업데이트하면 안 되는 필드 제거
  delete payload.id;
  delete payload.password;
  delete payload.styleId; // 이 경로에서는 부모 변경을 허용하지 않으므로 제거

  // 6) 업데이트 실행 (민감 필드 제외하고 필요한 필드만 select)
  const updated = await prisma.curating.update({
    where: { id: curationId },
    data: payload,
    select: {
      id: true,
      nickname: true,
      content: true,
      trandy: true,
      personality: true,
      practicality: true,
      costEffectiveness: true,
      createdAt: true,
    },
  });
  return res.status(200).json({ message: '수정됨', data: updated });
}
