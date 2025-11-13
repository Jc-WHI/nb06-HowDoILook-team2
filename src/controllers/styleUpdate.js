import {prisma} from '../lib/prismaClient.js'
import {assert, string, object, array, enums, number, record, optional} from 'superstruct'

export default async function styleUpdate(req, res, next) {
  try {
    // Normalize style id from params (preferred) or body, and coerce to number
    const idSource = req.params?.id ?? req.body?.id;
    const styleId = Number(idSource);

    if (!Number.isInteger(styleId)) {
      return res.status(400).json({ message: 'style id must be a valid number' });
    }

    // Ensure body exists and inject normalized ids for downstream validation/logic
    if (!req.body || typeof req.body !== 'object') req.body = {};
    req.body.styleId = styleId; // for schemas expecting "styleId"
    if (req.body.id === undefined) req.body.id = styleId; // backward compatibility

    const {title, content, password, categories, tags, imgUrls} = req.body;
    const data = {};
    const inputArray = [];
    if (title) {
        data.title = title;
        inputArray.push(title);

    }
    if (content) {
        data.content = content;
        inputArray.push(content);
    }
    if (password) data.password = password;

    if (categories) {
        data.categories = categories;
        inputArray.push(categories);
    }

    if (tags) {
        
        data.tag = tags;
        inputArray.push(tags);
    }
    if (imgUrls) {
        data.imageUrls = imgUrls;
        inputArray.push(imgUrls);
    }

    // include styleId for validation
    data.styleId = styleId;

    const stringArray = array(string());
    const category = enums(["top","bottom","outer","dress","shoes","bag","accessory"]);
    const categoryAttribute = object({ name: string(), brand: string(), price: number() });
    const categoriesStruct = record(enums(["top", "bottom", "outer", "dress", "shoes", "bag", "accessory"]), categoryAttribute);

    const styleInformation = object({
        styleId:number(),
        title: optional(string()),
        content: optional(string()),
        password: optional(string()),
        categories: optional(categoriesStruct),
        tag: optional(stringArray),
        imageUrls: optional(stringArray) 
    });

    try {
        assert(data, styleInformation); // Validate the data
    } catch (error) {
        return res.status(400).send(`Validation Error: ${error.message}`);
    }

    try {
        const userPassword = await prisma.style.findUnique({ where: { id: styleId }, select: { password: true } });
        if (userPassword && password === userPassword.password) {
            try {
                const updateData = {};
                if (data.title) updateData.title = data.title;
                if (data.content) updateData.content = data.content;
                if (data.password) updateData.password = data.password;
                if (data.categories) updateData.categories = data.categories;
                if (data.tag) updateData.tag = data.tag;
                if (data.imageUrls) updateData.imageUrls = data.imageUrls;

                const result = await prisma.style.upsert({
                    where: { id: styleId },
                    update: updateData,
                    create: { ...updateData }
                });

                // Sync relations (N:M tags, 1:N images). Only when corresponding fields are provided.
                await prisma.$transaction(async (tx) => {
                    // N:M tags
                    if (typeof data.tag !== 'undefined') {
                        const incomingTags = Array.isArray(data.tag) ? data.tag : [];
                        if (incomingTags.length === 0) {
                            // remove all tag relations
                            await tx.style.update({
                                where: { id: styleId },
                                data: { tags: { set: [] } }
                            });
                        } else {
                            // ensure all tags exist
                            const existingTags = await tx.tag.findMany({
                                where: { name: { in: incomingTags } },
                                select: { id: true, name: true }
                            });
                            const existingNames = new Set(existingTags.map(t => t.name));
                            const toCreate = incomingTags.filter(n => !existingNames.has(n));
                            if (toCreate.length) {
                                await tx.tag.createMany({
                                    data: toCreate.map(name => ({ name })),
                                    skipDuplicates: true
                                });
                            }
                            // set exact tag set (disconnect others)
                            const allTags = await tx.tag.findMany({
                                where: { name: { in: incomingTags } },
                                select: { id: true }
                            });
                            await tx.style.update({
                                where: { id: styleId },
                                data: { tags: { set: allTags } }
                            });
                        }
                    }

                    // 1:N images
                    if (typeof data.imageUrls !== 'undefined') {
                        const incomingImages = Array.isArray(data.imageUrls) ? data.imageUrls : [];
                        if (incomingImages.length === 0) {
                            // delete all images for this style
                            await tx.image.deleteMany({ where: { styleId } });
                        } else {
                            // create missing
                            const existingImages = await tx.image.findMany({
                                where: { styleId },
                                select: { id: true, url: true }
                            });
                            const existingUrls = new Set(existingImages.map(i => i.url));
                            const toCreateUrls = incomingImages.filter(u => !existingUrls.has(u));
                            if (toCreateUrls.length) {
                                await tx.image.createMany({
                                    data: toCreateUrls.map(url => ({ url, styleId })),
                                    skipDuplicates: true
                                });
                            }
                            // delete not included
                            await tx.image.deleteMany({
                                where: { styleId, url: { notIn: incomingImages } }
                            });
                        }
                    }

                    // If categories is a separate 1:N relation in your schema,
                    // implement a similar sync pattern here (upsert provided, delete not included).
                    // Example (adjust model/fields to your schema):
                    // if (typeof data.categories !== 'undefined') {
                    //   const keepTypes = Object.keys(data.categories || {});
                    //   await tx.styleCategory.deleteMany({ where: { styleId, type: { notIn: keepTypes } } });
                    //   for (const type of keepTypes) {
                    //     const attr = data.categories[type];
                    //     await tx.styleCategory.upsert({
                    //       where: { styleId_type: { styleId, type } },
                    //       update: { name: attr.name, brand: attr.brand, price: attr.price },
                    //       create: { styleId, type, name: attr.name, brand: attr.brand, price: attr.price }
                    //     });
                    //   }
                    // }
                });

                console.log("style updated!");
            } catch (error) {
                console.log("data is not valid!");
            }
        }
    } catch (error) {
        console.log("password is not valid!");
    }
  } catch (err) {
    next(err);
  }
}