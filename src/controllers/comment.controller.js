import { prisma } from '../lib/prismaClient.js';
import * as s from 'superstruct';
import { curationIdStruct, createCommentStruct } from '../structs/commentStructs.js';
import { NotFoundError, ForbiddenError } from '../lib/error.js';

//comment create =====
const createComment = async (req, res, next) => {
  const { curationId } = s.mask(req.params, curationIdStruct);
  const { content, password } = s.mask(req.body, createCommentStruct);

  //curatingData = 특정 curating(Id)이 등록된 스타일 게시글의 정보를 받아온다.
  const curatingData = await prisma.curating.findUniqueOrThrow({
    where: { id: curationId },
    include: { style: true },
  });

  // 큐레이팅 데이터가 없거나, 포함된 스타일 게시글을 못받아 온다면, return 404
  if (!curatingData.style) {
    return next(new NotFoundError());
  }

  //큐레이팅데이터에.받아온스타일정보중에.패스워드를 stylePassword에 적용
  const stylePassword = curatingData.style.password;

  //if 입력된 password !== stylePassword가 불일치하면, return 403
  if (password !== stylePassword) {
    return next(new ForbiddenError());
  }

  //입력된 비밀번호가 일치하면, 댓글 생성 진행
  const replyData = await prisma.comment.create({
    data: {
      content,

      curatingId: curationId,
    },
  });

  //명세서에 맞게 순서 조정
  const responseData = {
    id: replyData.id,
    nickname: curatingData.style.nickname,
    content: replyData.content,
    createdAt: replyData.createdAt,
  };

  return res.status(200).json(responseData);
};

//========== PUT comment ==========
const updateComment = async (req, res, next) => {
  const { commentId } = s.mask(req.params, commentIdStruct);
  const { content, password } = s.mask(req.body, putCommentStruct);

  const commentIdData = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
    include: { curating: { include: { style: true } } },
  });

  // 해당 댓글이 존재하지 않거나, curating 또는 style이 없을 경우 return 404
  if (!commentIdData || !commentIdData.curating || !commentIdData.curating.style) {
    return next(new NotFoundError());
  }

  //stylePassword 에 스타일 게시글에 있는 password 할당
  const stylePassword = commentIdData.curating.style.password;

  // 입력한 비밀번호가 stylePassword와 일치하지 않다면 return 403
  if (password !== stylePassword) {
    return next(new ForbiddenError());
  }

  // 입력한 비밀번호가 일치했으므로 댓글 수정 진행
  const updateData = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
    },
  });

  //순서에 맞게 responseData 작성
  const responseData = {
    id: updateData.id,
    nickname: commentIdData.curating.style.nickname,
    content: updateData.content,
    createdAt: updateData.createdAt,
  };
  return res.status(200).json(responseData);
};

export { createComment, updateComment };
