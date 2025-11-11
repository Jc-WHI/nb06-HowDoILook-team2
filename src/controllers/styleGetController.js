import { prisma } from '../lib/prismaClient.js';

export async function styleListGallery(req, res) {
  // 로직을 만들기 위해서 어떤 req 재료들이 필요한가?
  const { page = 1, pageSize = 10, sortBy = 'latest', searchBy, keyword, tag } = req.query;

  // 페이지네이션을 위한 재료 손질 skip,take 를 위한 page, pageSize 손질
  const skip = Number(page - 1) * pageSize;
  const take = Number(pageSize);

  // 목록을 나열할 기준을 위한 재료 손질 orderBy를 위한 sortBy 손질
  let orderBy = { createdAt: 'desc' };
  if (sortBy === 'mostViewed') orderBy = { viewCount: 'desc' };
  if (sortBy === 'mostCurated') orderBy = { _count: { curating: 'desc' } }; // 숫자를 세서 큐레이팅이 많은 순으로 정렬한다.

  // 어떤 조건의 style들을 가져올 건인가? where의 값을 어떻게 할 것인가? searchBy와 keyword의 재료손질
  let where = {};
  if (searchBy && keyword) {
    if (searchBy === 'nickname') where.nickname = { contains: keyword };
    else if (searchBy === 'title') where.title = { contains: keyword };
    else if (searchBy === 'content') where.content = { contains: keyword };
    else if (searchBy === 'tag') where.tag = { some: { tags: { contains: keyword } } };
  }

  // tag를 클릭했을 때 이동하게 할 로직
  if (tag) where.tag = { some: { tags: { equals: tag } } };

  // 손질해둔 재료들을 요리하는 작업 : style을 입맛대로 담기
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
        // 큐레이션 갯수 가져옴
        select: {
          curating: true,
        },
      },
      createdAt: true,
      tag: {
        // tags를 가져옴
        select: {
          tags: true,
        },
      },
      item: {
        // 구성을 가져옴
        select: {
          categories: true,
          name: true,
          brand: true,
          price: true,
        },
      },
      image: {
        // urls를 가져옴
        select: {
          imageUrls: true,
        },
      },
    },
  });

  // 이제부터 리스폰을 보낼 떄 어떻게 할지 고민해야함 totalItemCount, totalPages PopularTags 등
  const totalItemCount = await prisma.style.count({ where });
  const totalPages = Math.ceil(totalItemCount / take);

  // 만들어진 요리를 약속대로 포장해줘야함 : response 약속대로 포장
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
  // 마무리 포장까지 해서 보내줘버림
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
export async function styleGetId(req, res) {
  const id = Number(req.params.styleId);

  await prisma.style.updateMany({
    // update는 오류가 생김 updateMany시 존재X면 0개 업데이트
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  const data = await prisma.style.findUnique({
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

  if (!data) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

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
