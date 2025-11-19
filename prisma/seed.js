import { prisma } from '../src/lib/prismaClient.js';
import { mockStyles } from './mock.js';

async function resetDB() {
  const models = ['comment', 'curating', 'tag', 'item', 'image', 'style'];

  for (const model of models) {
    const modelClient = prisma[model];
    try {
      await modelClient.deleteMany();
      console.log(`✅ Cleared ${model}`);
    } catch (e) {
      console.warn(`⚠️ Skipped ${model}:`, e.message);
    }
  }

  console.log('✅ DB reset complete');
}

async function seedStyles() {
  for (const style of mockStyles) {
    const createdStyle = await prisma.style.create({
      data: {
        nickname: style.nickname,
        title: style.title,
        content: style.content,
        password: style.password,

        image: {
          create: style.imageUrls.map((url) => ({ imageUrls: url })),
        },

        tag: {
          connectOrCreate: style.tags.map((tagName) => ({
            where: { tags: tagName },
            create: { tags: tagName },
          })),
        },

        item: {
          create: Object.entries(style.categories)
            .filter(([_, v]) => v !== null)
            .map(([category, value]) => ({
              name: value.name,
              brand: value.brand,
              price: value.price,
              categories: category,
            })),
        },

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
