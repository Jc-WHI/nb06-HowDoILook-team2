import { prisma } from '../src/lib/prismaClient.js';
import { mockStyles } from './mock.js';

async function resetDB() {
  // DB 초기화 (삭제 순서 중요)
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.curating.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.item.deleteMany(),
    prisma.image.deleteMany(),
    prisma.style.deleteMany(),
  ]);
  console.log('✅ DB reset complete');
}

async function seedStyles() {
  for (const style of mockStyles) {
    // Style 생성
    const createdStyle = await prisma.style.create({
      data: {
        nickname: style.nickname,
        title: style.title,
        content: style.content,
        password: style.password,

        // Image 생성
        image: {
          create: style.imageUrls.map((url) => ({
            imageUrls: url,
          })),
        },

        // Tag 연결 또는 생성
        tag: {
          connectOrCreate: style.tags.map((tagName) => ({
            where: { tags: tagName },
            create: { tags: tagName },
          })),
        },

        // Item 생성 (카테고리별)
        item: {
          create: Object.entries(style.categories)
            .filter(([_, v]) => v !== null)
            .map(([category, value]) => ({
              name: value.name,
              brand: value.brand,
              price: value.price,
              categories: category, // Enum으로 전달
            })),
        },

        // Curating 생성
        curating: style.curatings
          ? {
              create: style.curatings.map((c) => ({
                nickname: c.nickname,
                content: c.content,
                password: c.password,
                trendy: c.trendy,
                personality: c.personality,
                practicality: c.practicality,
                costEffectiveness: c.costEffectiveness,
              })),
            }
          : undefined,
      },
    });

    console.log(`✨ Created style: ${createdStyle.title}`);
  }
  console.log('✅ Style seed complete');
}

async function main() {
  try {
    await resetDB();
    await seedStyles();
  } catch (e) {
    console.error('❌ Seed error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
