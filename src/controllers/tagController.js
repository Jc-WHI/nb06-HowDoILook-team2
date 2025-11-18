import { prisma } from '../lib/prismaClient.js';

export const getPopularTags = async (req, res, next) => {
  const popularTags = await prisma.tag.findMany({
    select: {
      id: true,
      tags: true,
      _count: {
        select: {
          style: true,
        },
      },
    },
    orderBy: {
      style: {
        _count: 'desc',
      },
    },
    take: 7,
  });

  res.status(200).json({ tags: popularTags.map((tag) => tag.tags) });
};
