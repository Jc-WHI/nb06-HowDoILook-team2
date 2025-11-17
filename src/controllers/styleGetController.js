















































































































































































































































// 스타일 상세 조회
export async function styleGetId(req, res, next) {
  const { styleId } = s.create(req.params, styleIdStruct);
  const id = parseInt(styleId);

  await prisma.style.updateMany({
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

  const categories = {};
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
