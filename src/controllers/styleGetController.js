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
  const formettedData = style.map((s) => {
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
    data: formettedData,
  });
}
