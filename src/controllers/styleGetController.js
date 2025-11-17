import { prisma } from '../lib/prismaClient.js';

// 스타일 갤러리 목록
export async function styleListGallery(req, res, next) {
  const { page = 1, pageSize = 10, sortBy = 'latest', searchBy, keyword, tag } = req.query;

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

export async function styleListRank(req, res) {
  const { page = 1, pageSize = 10, rankBy = 'total' } = req.query;

  const skip = Number(page - 1) * Number(pageSize);
  const take = Number(pageSize);

  // 일단 랭킹을 만들기 위해서 큐레이션이 존재하는 게시글들을 가져옴
  const data = await prisma.style.findMany({
    where: { curating: { some: {} } }, // 큐레이팅이 1개 이상 있는 게시글만 찾아옴
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
        // curationCount 를 위한 카운트
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

  // 페이지네이션 정보 리스폰 재료
  const totalItemCount = await prisma.style.count({
    where: { curating: { some: {} } },
  });
  const totalPages = Math.ceil(totalItemCount / take); // 소숫점 올림처리

  // 이제 전체,트랜디,개성,실용성,가성비 의 각 평균점수를 만듦
  const stylesWithAvg = data.map((style) => {
    const curatings = style.curating;

    const totalScore = curatings.reduce((acc, c) => {
      return acc + c.trendy + c.personality + c.practicality + c.costEffectiveness;
    }, 0);

    const avgScore = totalScore / (curatings.length * 4); //전체 평균 점수

    const fieldAvg = {
      // 필드별 평균 점수
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

  // 점수가 높은 순서로 나열
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
    else rating = s.fieldAvg[rankBy]; // 대괄호 표기법 응용

    return {
      id: s.id,
      thumbnail: s.image[0].imageUrls, // 이미지가 무조건 있다는 가정. 유효성 처리하면 될듯
      nickname: s.nickname,
      title: s.title,
      tags: s.tag.map((t) => t.tags), // tags를 꺼냄
      categories: categories,
      viewCount: s.viewCount,
      curationCount: s._count.curating, // findMany 안에서 찾아옴
      createdAt: s.createdAt,
      ranking: index + 1, // 인덱스 번호 0부터 시작이니까 +1 해주면 평균값이 높은 순서로 순위가 정해짐
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
