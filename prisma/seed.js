import { PrismaClient } from '@prisma/client';
import { mockStyles } from './mock.js';

const prisma = new PrismaClient();

async function resetDB() {
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
      },
    });

    console.log(`✨ Created style: ${createdStyle.title}`);
  }
  console.log('✅ Style seed complete');
}

async function main() {
  await resetDB();
  await seedStyles();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
