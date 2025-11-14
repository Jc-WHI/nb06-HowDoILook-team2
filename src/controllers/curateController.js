import { create } from 'superstruct';
import {
  createCurateStruct,
  deleteCurateStruct,
  curationIdStruct,
  pageParamsStruct,
  styleIdStruct,
  updateCurateStruct,
} from '../structs/curateStructs.js';
import NotFoundError from '../lib/error.js';
import { prisma } from '../lib/prismaClient.js';
//req.params: 리소스 위치
//req.query: 필터링 / 페이지네이션
//req.body: 보내는 실제 데이터
export async function createCurating(req, res) {
  //'style/:styleId' 라우트 경로 설정
  const { styleId } = create(req.params, styleIdStruct);
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
//=-------------------------------------
export async function updateCurating(req, res) {
  const { curationId } = create(req.params, curationIdStruct);
  const payload = create(req.body, updateCurateStruct);
  const findCurate = await prisma.curating.findUnique({ where: { id: curationId } });
  if (!findCurate) {
    throw new NotFoundError('curating', curationId);
  }
  if (payload.password !== findCurate.password) {
    return res.status(403).json({ message: '비밀번호가 틀렸습니다.' }); //리퀘스트 보낸 비밀번호와 수정할 큐레이팅의 비밀번호 일치 검사
  }
  const data = {
    // 점수,텍스트 미전송,null 허용
    nickname: payload.nickname ?? findCurate.nickname,
    content: payload.content ?? findCurate.content,
    trendy: payload.trendy == null ? findCurate.trendy : payload.trendy,
    personality: payload.personality == null ? findCurate.personality : payload.personality,
    practicality: payload.practicality == null ? findCurate.practicality : payload.practicality,
    costEffectiveness:
      payload.costEffectiveness == null ? findCurate.costEffectiveness : payload.costEffectiveness,
  };
  const updated = await prisma.curating.update({
    where: { id: curationId },
    data,
    select: {
      id: true,
      nickname: true,
      content: true,
      trendy: true,
      personality: true,
      practicality: true,
      costEffectiveness: true,
      createdAt: true,
    },
  });
  return res.status(200).json(updated);
}
//-----------------------------------------------
export async function deleteCurating(req, res) {
  const { curationId } = create(req.params, curationIdStruct);
  const { password } = create(req.body, deleteCurateStruct);
  const findCurate = await prisma.curating.findUnique({ where: { id: curationId } });
  if (!findCurate) {
    throw new NotFoundError('curating', curationId);
  }
  if (password !== findCurate.password) {
    return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
  }
  await prisma.curating.delete({ where: { id: curationId } });
  return res.status(200).json({ message: '큐레이팅 삭제 성공' });
}
//---------------------------------------------
export async function getCuratingList(req, res) {
  const { styleId } = create(req.params, styleIdStruct);
  const { page, pageSize, searchBy, keyword } = create(req.query, pageParamsStruct);
  const skip = (page - 1) * pageSize;
  const baseWhere = { styleId };
  const where = keyword //삼항 연산자// 조건 ? 참일 때 실행 : 거짓일 때 실행, 키워드 검색이 안되면 if문을 통해서 메세지 호출
    ? { ...baseWhere, [searchBy]: { contains: keyword, mode: 'insensitive' } }
    : baseWhere;
  const [totalItemCount, rows] = await Promise.all([
    prisma.curating.count({ where }),
    prisma.curating.findMany({
      where,
      orderBy: { id: 'asc' },
      skip,
      take: pageSize,
      select: {
        id: true,
        nickname: true,
        content: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true,
        comment: {
          select: { id: true, content: true, createdAt: true },
        },
        style: {
          select: { nickname: true },
        },
      },
    }),
  ]);
  const totalPages = totalItemCount === 0 ? 0 : Math.ceil(totalItemCount / pageSize);
  const data = rows.map((r) => ({
    id: r.id,
    nickname: r.nickname,
    content: r.content,
    trendy: r.trendy,
    personality: r.personality,
    practicality: r.practicality,
    costEffectiveness: r.costEffectiveness,
    createdAt: r.createdAt,
    comment: r.comment //r.comment 는 배열, 댓글이 없으면 null이아닌 []빈 배열이고, 빈 배열은 truthy라 nickname: r.style.nickname을 댓글이 있어도, 없어도 반환하게 됨
      ? {
          id: r.comment.id,
          nickname: r.style.nickname,
          content: r.comment.content,
          createdAt: r.comment.createdAt,
        }
      : {},
  }));
  if (totalItemCount === 0) {
    return res.status(200).json({ message: '아직 큐레이션이 없어요.' });
  }
  return res.status(200).json({
    currentPage: page,
    totalPages,
    totalItemCount,
    data,
  });
}
