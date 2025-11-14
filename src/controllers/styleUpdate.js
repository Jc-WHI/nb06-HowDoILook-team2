import {prisma} from '../lib/prismaClient.js'
import {assert, string, object, array, enums, number, record, optional} from 'superstruct'

async function styleUpdate(req, res, next) {
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

    const { title, content, password, categories, tags, imgUrls } = req.body;
    const data = {};
    if (title) data.title = title;
    if (content) data.content = content;
    if (password) data.password = password;
    if (categories) data.categories = categories; // keep for validation & later relational sync
    if (tags) data.tag = tags;                    // may skip if relation not present
    if (imgUrls) data.imageUrls = imgUrls;        // keep for relational sync
    data.styleId = styleId;

    const stringArray = array(string());
    const categoryAttribute = object({ name: string(), brand: string(), price: number() });
    const categoriesStruct = record(enums(["top", "bottom", "outer", "dress", "shoes", "bag", "accessory"]), categoryAttribute);
    const styleInformation = object({
      styleId: number(),
      title: optional(string()),
      content: optional(string()),
      password: optional(string()),
      categories: optional(categoriesStruct),
      tag: optional(stringArray),
      imageUrls: optional(stringArray)
    });

    try {
      assert(data, styleInformation);
    } catch (e) {
      return res.status(400).json({ message: 'Validation Error', detail: e.message });
    }

    // Find existing style
    const existing = await prisma.style.findUnique({ where: { id: styleId }, select: { id: true, password: true } });
    if (!existing) return res.status(404).json({ message: 'Style not found' });
    if (!password) return res.status(400).json({ message: 'Password required' });
    if (password !== existing.password) return res.status(403).json({ message: 'Password mismatch' });

    // Whitelist scalar fields actually present on Style
    const allowedScalar = ['title','content','password','nickname','viewCount','curationCount','createdAt'];
    const updateData = {};
    for (const key of allowedScalar) {
      if (typeof data[key] !== 'undefined') updateData[key] = data[key];
    }

    // Explicitly remove relational keys if somehow attached
    delete updateData.categories;
    delete updateData.tag;
    delete updateData.imageUrls;

    console.log('Style updateData (sanitized):', updateData);

    // Update core fields first
    await prisma.style.update({ where: { id: styleId }, data: updateData });

    // Sync relational data inside a transaction
    await prisma.$transaction(async (tx) => {
      // Images sync (assuming Image model with url + styleId)
      if (typeof data.imageUrls !== 'undefined') {
        const incoming = Array.isArray(data.imageUrls) ? data.imageUrls : [];
        if (incoming.length === 0) {
          await tx.image.deleteMany({ where: { styleId } });
        } else {
          const existingImages = await tx.image.findMany({ where: { styleId }, select: { url: true } });
          const existingSet = new Set(existingImages.map(i => i.url));
          const toCreate = incoming.filter(u => !existingSet.has(u));
          if (toCreate.length) {
            await tx.image.createMany({ data: toCreate.map(url => ({ url, styleId })), skipDuplicates: true });
          }
          await tx.image.deleteMany({ where: { styleId, url: { notIn: incoming } } });
        }
      }

      // Categories sync via item relation (assuming Item with unique (styleId,type))
      if (typeof data.categories !== 'undefined') {
        const incomingCategories = data.categories || {};
        const keepTypes = Object.keys(incomingCategories);
        // Delete removed
        await tx.item.deleteMany({ where: { styleId, type: { notIn: keepTypes } } });
        // Upsert each
        for (const type of keepTypes) {
          const { name, brand, price } = incomingCategories[type];
          // Attempt upsert (requires unique constraint styleId_type)
          await tx.item.upsert({
            where: { styleId_type: { styleId, type } },
            update: { name, brand, price },
            create: { styleId, type, name, brand, price }
          }).catch(async () => {
            // Fallback: try update then create if constraint not set
            const existingItem = await tx.item.findFirst({ where: { styleId, type } });
            if (existingItem) {
              await tx.item.update({ where: { id: existingItem.id }, data: { name, brand, price } });
            } else {
              await tx.item.create({ data: { styleId, type, name, brand, price } });
            }
          });
        }
      }

      // Tags relation skipped (not in Style update options list). Implement if schema has tags.
      // if (typeof data.tag !== 'undefined') { /* implement when relation confirmed */ }
    });

    // Fetch updated style with relations
    const updated = await prisma.style.findUnique({
      where: { id: styleId },
      include: {
        image: true, // relation name per error list (image?)
        item: true   // categories mapped here
        // tags: true // uncomment if relation exists
      }
    });

    return res.status(200).json({ message: 'Style updated', style: updated });
  } catch (err) {
    return next(err);
  }
}

export default styleUpdate