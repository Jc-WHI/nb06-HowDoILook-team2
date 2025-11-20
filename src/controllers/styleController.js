import { prisma } from '../lib/prismaClient.js';
import * as s from 'superstruct';
import {
  createStyleBodyStruct,
  styleDeleteStruct,
  styleIdStruct,
  styleListGallaryQueryStruct,
  styleListRankQueryStruct,
  updateStyleBodyStruct,
} from '../structs/styleStruct.js';
import { Category } from '@prisma/client';
import { BadRequestError, ForbiddenError, NotFoundError } from '../lib/error.js';

// 스타일 갤러리 목록 조회
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
  if (sortBy === 'mostCurated') orderBy = { curating: { _count: 'desc' } };

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

// 스타일 랭킹 목록 조회
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

  const paginatedData = formattedData.slice(skip, skip + take);

  res.status(200).json({
    currentPage: page,
    totalPages: totalPages,
    totalItemCount: totalItemCount,
    data: paginatedData,
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

  let formattedCategories = {};
  result.item.forEach((i) => {
    formattedCategories[i.categories] = {
      name: i.name,
      brand: i.brand,
      price: i.price,
    };
  });

  res.status(201).json({
    id: result.id,
    nickname: result.nickname,
    title: result.title,
    content: result.content,
    viewCount: result.viewCount,
    curationCount: result.curationCount,
    createdAt: result.createdAt,
    categories: formattedCategories,
    tags: result.tag.map((t) => t.tags),
    imageUrls: result.image.map((i) => i.imageUrls),
  });
}

// 스타일 삭제 - 스타일  id 필요
export async function deleteStyle(req, res, next) {
  s.create(req.params, styleIdStruct);
  const { password } = s.create(req.body, styleDeleteStruct);
  const { styleId } = s.create(req.params, styleIdStruct);

  if (!password) return next(new BadRequestError());

  const style = await prisma.style.findUniqueOrThrow({
    where: { id: styleId },
    include: { tag: true },
  });

  if (style.password !== password) return next(new ForbiddenError());

  await prisma.$transaction(async (tx) => {
    for (const t of style.tag) {
      const tagWithCount = await tx.tag.findUniqueOrThrow({
        where: { id: t.id },
        include: { _count: { select: { style: true } } },
      });

      await tx.style.update({
        where: { id: styleId },
        data: { tag: { disconnect: { id: t.id } } },
      });

      if (tagWithCount._count.style <= 1) {
        await tx.tag.delete({
          where: { id: t.id },
        });
      }
    }
    await tx.style.delete({ where: { id: styleId } });
  });

  res.status(200).json({ message: '스타일 삭제 성공' });
}

// 스타일 수정
export async function styleUpdate(req, res, next) {
  const { styleId } = s.create(req.params, styleIdStruct);
  const { categories, tags, imageUrls, password, ...body } = s.create(
    req.body,
    updateStyleBodyStruct,
  );

  // password 확인과 update, create, delete를 어떻게 할지 비교, 판단을 위해서 데이터 호출
  const style = await prisma.style.findUniqueOrThrow({
    where: { id: parseInt(styleId) },
    include: {
      tag: true,
      image: true,
      item: true,
    },
  });

  // 비밀번호가 일치한지 확인
  if (password !== style.password) return next(new ForbiddenError());

  // tag 싱크
  const newTags = tags || [];

  // image 싱크
  const existingImages = style.image.map((i) => i.imageUrls);
  const newImages = imageUrls || [];

  // 추가할 imageUrls
  const imageUrlsToAdd = newImages.filter((i) => !existingImages.includes(i));

  // tag,image 트랜잭션
  await prisma.$transaction([
    // 태그 연결 해제(제거), 태그 연결 또는 생성
    prisma.style.update({
      // 스타일과 연결된 태그 연결 해제
      where: { id: style.id },
      data: {
        tag: {
          disconnect: style.tag.filter((t) => !newTags.includes(t.tags)).map((t) => ({ id: t.id })),
        },
      },
    }),

    prisma.style.update({
      // db에 존재하는 태그와 연결히거나 없으면 생성
      where: { id: style.id },
      data: {
        tag: {
          connectOrCreate: newTags.map((t) => ({
            where: { tags: t },
            create: { tags: t },
          })),
        },
      },
    }),

    // 이미지 삭제, 추가
    prisma.image.deleteMany({
      // image 삭제 (db에는 있는데 요청에 없을 때)
      where: {
        styleId: style.id,
        imageUrls: { notIn: newImages },
      },
    }),

    prisma.image.createMany({
      // image 추가 (db에는 없는데 요청이 있을 때)
      data: imageUrlsToAdd.map((i) => ({ imageUrls: i, styleId: style.id })),
    }),
  ]);

  // item 싱크
  const existingItems = style.item || []; //db 데이터
  const newItems = Object.entries(categories || {}); // 요청 데이터

  // 트랜잭션에 넣을 배열 초기화
  const createOps = []; // 새로 추가할 item
  const updateOps = []; // 기존 item을 수정할 경우
  const deleteOps = []; // DB에는 있는데 요청에는 없는 item 삭제

  // 새 요청 데이터 기준으로 create/update 나누기
  for (const [category, info] of newItems) {
    const existing = existingItems.find((i) => i.categories === category); // db도 있고 요청도 있으면

    if (existing) {
      updateOps.push(
        prisma.item.update({
          where: { id: existing.id },
          data: {
            name: info.name,
            brand: info.brand,
            price: info.price,
          },
        }),
      );
    } else {
      createOps.push(
        prisma.item.create({
          data: {
            name: info.name,
            brand: info.brand,
            price: info.price,
            styleId: style.id,
            categories: category,
          },
        }),
      );
    }
  }

  // DB에 있지만 요청에는 없는 카테고리 = 제거
  const newCategories = newItems.map(([category]) => category);
  const deleteTargets = existingItems.filter((i) => !newCategories.includes(i.categories));

  for (const target of deleteTargets) {
    deleteOps.push(
      prisma.item.delete({
        where: { id: target.id },
      }),
    );
  }

  // item 트랜잭션
  await prisma.$transaction([...createOps, ...updateOps, ...deleteOps]);

  const data = await prisma.style.update({
    where: { id: parseInt(styleId) },
    data: {
      ...body,
      password,
    },
    include: {
      item: true,
      image: true,
      tag: true,
    },
  });

  const categoryData = {};
  data.item.forEach((i) => {
    categoryData[i.categories] = {
      name: i.name,
      brand: i.brand,
      price: i.price,
    };
  });

  res.status(200).json({
    id: data.id,
    nickname: data.nickname,
    title: data.title,
    content: data.content,
    viewCount: data.viewCount,
    curationCount: data.curationCount,
    createdAt: data.createdAt,
    categories: categoryData,
    tags: data.tag.map((t) => {
      return t.tags;
    }),
    imageUrls: data.image.map((i) => {
      return i.imageUrls;
    }),
  });
}

// 스타일 상세 정보 조회
export async function styleGetId(req, res, next) {
  // 유효성 검사
  const { styleId } = s.create(req.params, styleIdStruct);
  const id = parseInt(styleId);

  await prisma.style.updateMany({
    // update는 오류가 생김 updateMany시 존재X면 0개 업데이트
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  const data = await prisma.style.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      nickname: true,
      title: true,
      content: true,
      viewCount: true,
      createdAt: true,
      item: {
        select: {
          categories: true,
          name: true,
          brand: true,
          price: true,
        },
      },
      tag: {
        select: {
          tags: true,
        },
      },
      image: {
        select: {
          imageUrls: true,
        },
      },
      _count: {
        select: {
          curating: true,
        },
      },
    },
  });

  const categories = {}; // 스타일 구성 중첩담기
  data.item.forEach((i) => {
    categories[i.categories] = {
      name: i.name,
      brand: i.brand,
      price: i.price,
    };
  });

  const formattedData = {
    id: data.id,
    nickname: data.nickname,
    title: data.title,
    content: data.content,
    viewCount: data.viewCount,
    curationCount: data._count.curating,
    createdAt: data.createdAt,
    categories: categories,
    tags: data.tag.map((t) => t.tags),
    imageUrls: data.image.map((i) => i.imageUrls),
  };

  res.status(200).json(formattedData);
}
