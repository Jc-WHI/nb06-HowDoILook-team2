import { prisma } from '../lib/prismaClient.js';
import * as s from 'superstruct';
import {
  createStyleBodyStruct,
  styleDeleteStruct,
  styleIdStruct,
  styleListGallaryQueryStruct,
  styleListRankQueryStruct,
} from '../structs/styleStruct.js';
import { Category } from '@prisma/client';
import { BadRequestError, ForbiddenError, NotFoundError } from '../lib/error.js';

// 스타일 갤러리 목록
export async function styleListGallery(req, res, next) {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'latest',
    searchBy,
    keyword,
    tag,
  } = s.create(req.query, styleListGallaryQueryStruct);

  const skip = Number(page - 1) * pageSize;
  const take = Number(pageSize);

  let orderBy = { createdAt: 'desc' };
  if (sortBy === 'mostViewed') orderBy = { viewCount: 'desc' };
  if (sortBy === 'mostCurated') orderBy = { _count: { curating: 'desc' } };

  let where = {};
  if (searchBy && keyword) {
    if (searchBy === 'nickname') where.nickname = { contains: keyword };
    else if (searchBy === 'title') where.title = { contains: keyword };
    else if (searchBy === 'content') where.content = { contains: keyword };
    else if (searchBy === 'tag') where.tag = { some: { tags: { contains: keyword } } };
  }

  if (tag) where.tag = { some: { tags: { equals: tag } } };

  const style = await prisma.style.findMany({
    skip,
    take,
    orderBy,
    where,
    select: {
      id: true,
      title: true,
      nickname: true,
      content: true,
      viewCount: true,
      _count: {
        select: {
          curating: true,
        },
      },
      createdAt: true,
      tag: {
        select: {
          tags: true,
        },
      },
      item: {
        select: {
          categories: true,
          name: true,
          brand: true,
          price: true,
        },
      },
      image: {
        select: {
          imageUrls: true,
        },
      },
    },
  });

  const totalItemCount = await prisma.style.count({ where });
  const totalPages = Math.ceil(totalItemCount / take);

  const formattedData = style.map((s) => {
    const categories = {};
    s.item.forEach((i) => {
      categories[i.categories] = {
        name: i.name,
        brand: i.brand,
        price: i.price,
      };
    });
    return {
      id: s.id,
      thumbnail: s.image[0].imageUrls,
      nickname: s.nickname,
      title: s.title,
      tags: s.tag.map((t) => t.tags),
      categories: categories,
      content: s.content,
      viewCount: s.viewCount,
      curationCount: s._count.curating,
      createdAt: s.createdAt,
    };
  });

  res.status(200).json({
    currentPage: Number(page),
    totalPages: totalPages,
    totalItemCount: totalItemCount,
    data: formattedData,
  });
}

// 스타일 랭킹 목록
export async function styleListRank(req, res, next) {
  const {
    page = 1,
    pageSize = 10,
    rankBy = 'total',
  } = s.create(req.query, styleListRankQueryStruct);

  const skip = Number(page - 1) * Number(pageSize);
  const take = Number(pageSize);

  const data = await prisma.style.findMany({
    where: { curating: { some: {} } },
    skip,
    take,
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      viewCount: true,
      createdAt: true,
      _count: {
        select: {
          curating: true,
        },
      },
      image: {
        select: {
          imageUrls: true,
        },
      },
      tag: {
        select: {
          tags: true,
        },
      },
      item: {
        select: {
          categories: true,
          name: true,
          brand: true,
          price: true,
        },
      },
      curating: {
        select: {
          trendy: true,
          personality: true,
          practicality: true,
          costEffectiveness: true,
        },
      },
    },
  });

  const totalItemCount = await prisma.style.count({
    where: { curating: { some: {} } },
  });
  const totalPages = Math.ceil(totalItemCount / take);

  const stylesWithAvg = data.map((style) => {
    const curatings = style.curating;

    const totalScore = curatings.reduce((acc, c) => {
      return acc + c.trendy + c.personality + c.practicality + c.costEffectiveness;
    }, 0);

    const avgScore = totalScore / (curatings.length * 4);

    const fieldAvg = {
      trendy: curatings.reduce((acc, c) => acc + c.trendy, 0) / curatings.length,
      personality: curatings.reduce((acc, c) => acc + c.personality, 0) / curatings.length,
      practicality: curatings.reduce((acc, c) => acc + c.practicality, 0) / curatings.length,
      costEffectiveness:
        curatings.reduce((acc, c) => acc + c.costEffectiveness, 0) / curatings.length,
    };

    return {
      ...style,
      avgScore,
      fieldAvg,
    };
  });

  if (rankBy) {
    if (rankBy === 'trendy') stylesWithAvg.sort((a, b) => b.fieldAvg.trendy - a.fieldAvg.trendy);
    else if (rankBy === 'personality')
      stylesWithAvg.sort((a, b) => b.fieldAvg.personality - a.fieldAvg.personality);
    else if (rankBy === 'practicality')
      stylesWithAvg.sort((a, b) => b.fieldAvg.practicality - a.fieldAvg.practicality);
    else if (rankBy === 'costEffectiveness')
      stylesWithAvg.sort((a, b) => b.fieldAvg.costEffectiveness - a.fieldAvg.costEffectiveness);
    else stylesWithAvg.sort((a, b) => b.avgScore - a.avgScore);
  }

  const formattedData = stylesWithAvg.map((s, index) => {
    const categories = {};
    s.item.forEach((i) => {
      categories[i.categories] = {
        name: i.name,
        brand: i.brand,
        price: i.price,
      };
    });

    let rating;
    if (rankBy === 'total') rating = s.avgScore;
    else rating = s.fieldAvg[rankBy];

    rating = Number(rating.toFixed(1));

    return {
      id: s.id,
      thumbnail: s.image[0].imageUrls,
      nickname: s.nickname,
      title: s.title,
      tags: s.tag.map((t) => t.tags),
      categories: categories,
      viewCount: s.viewCount,
      curationCount: s._count.curating,
      createdAt: s.createdAt,
      ranking: index + 1,
      rating: rating,
    };
  });

  res.status(200).json({
    currentPage: page,
    totalPages: totalPages,
    totalItemCount: totalItemCount,
    data: formattedData,
  });
}

// 스타일 등록
export async function createStyle(req, res, next) {
  const { nickname, title, content, password, categories, tags, imageUrls } = s.create(
    req.body,
    createStyleBodyStruct,
  ); //필요한 변수들은 request body로 부터, 구조분해 할당을 통해 선언 및 할당을 한다.

  //nickname, title, content, password || categories || tag, imageUrl 세가지는 다르게 처리를 해야함
  // 따라서 트랜잭션 처리를 통해 db와 상호작용해야 한다.
  const result = await prisma.$transaction(async (tx) => {
    const style = await tx.style.create({
      data: { nickname, title, content, password },
    });

    for (const [catKey, value] of Object.entries(categories)) {
      if (!Object.values(Category).includes(catKey)) continue;
      await tx.item.create({
        data: {
          name: value.name,
          brand: value.brand,
          price: value.price,
          categories: catKey,
          styleId: style.id,
        },
      });
    }

    //tags는 배열이어야 하며(문자열 배열), 비어있지 말아야 한다
    for (const tagName of tags) {
      const tag = await tx.tag.upsert({
        where: { tags: tagName },
        update: {},
        create: { tags: tagName },
      });
      await tx.style.update({
        where: { id: style.id },
        data: { tag: { connect: { id: tag.id } } },
      });
    }

    // imgUrls는 배열이어야 하며 (문자열 배열), 비어있지 말아야 한다
    await tx.image.createMany({
      data: imageUrls.map((url) => ({ styleId: style.id, imageUrls: url })),
    });

    return tx.style.findUnique({
      where: { id: style.id },
      include: { tag: true, image: true, item: true },
    });
  });

  res.status(201).json(result);
}

// 스타일 삭제 - 스타일  id 필요
export async function deleteStyle(req, res, next) {
  s.assert(req.params, styleIdStruct);
  const { password } = s.create(req.body, styleDeleteStruct);
  const styleId = parseInt(req.params.styleId);

  const style = await prisma.style.findUniqueOrThrow({ where: { id: styleId } });

  if (!password) return next(new BadRequestError());
  if (style.password !== password) return next(new ForbiddenError());

  await prisma.style.delete({ where: { id: styleId } });

  res.status(200).json({ message: '스타일 삭제 성공' });
}
