
// ...existing code...
const { PrismaClient, Category } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 업데이트 규칙:
 * - password 검증 실패 시 에러
 * - 기본 스타일 필드(title, nickname, content 등)는 요청에 존재하는 것만 업데이트
 * - categories: 전달된 key만 upsert (기존에 없으면 create, 있으면 update), 미전달된 카테고리는 그대로 둠
 * - tags/imgUrls: 필드가 존재하면 모두 delete 후 재생성, 없으면 유지
 */
async function updateStyle(styleId, body) {
  const style = await prisma.style.findUnique({ where: { id: styleId } });
  if (!style) {
    const err = new Error('Style not found');
    err.status = 404;
    throw err;
  }
  if (!body.password || body.password !== style.password) {
    const err = new Error('Invalid password');
    err.status = 403;
    throw err;
  }

  const { tags, imgUrls, categories, password, ...styleFields } = body;

  return await prisma.$transaction(async (tx) => {
    if (Object.keys(styleFields).length) {
      await tx.style.update({
        where: { id: styleId },
        data: styleFields,
      });
    }

    if (categories && typeof categories === 'object') {
      for (const [catKey, value] of Object.entries(categories)) {
        // 안전한 enum 매핑
        if (!Object.values(Category).includes(catKey)) continue;
        const existing = await tx.item.findFirst({
          where: { styleId, categories: catKey },
        });
        const payload = {
          name: value.name,
          brand: value.brand,
          price: value.price,
          categories: catKey,
          styleId,
        };
        if (existing) {
          await tx.item.update({
            where: { id: existing.id },
            data: payload,
          });
        } else {
          await tx.item.create({ data: payload });
        }
      }
    }

    if (Array.isArray(tags)) {
      await tx.tag.deleteMany({ where: { styleId } });
      if (tags.length) {
        await tx.tag.createMany({
          data: tags.map((t) => ({ styleId, tags: t })),
        });
      }
    }

    if (Array.isArray(imgUrls)) {
      await tx.image.deleteMany({ where: { styleId } });
      if (imgUrls.length) {
        await tx.image.createMany({
          data: imgUrls.map((u) => ({ styleId, imageUrls: u })),
        });
      }
    }

    return tx.style.findUnique({
      where: { id: styleId },
      include: {
        Tag: true,
        image: true,
        item: true,
      },
    });
  });
}

module.exports = { updateStyle };
// ...existing code...