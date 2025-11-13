
// ...existing code...

// 필요한 경우 경로 조정
const styleService = require('../services/style.service');

// 요청 바디 키 표준화 유틸
function normalizeStyleBody(body) {
  return {
    id: typeof body.id === 'string' ? Number(body.id) : body.id,
    password: body.password,
    content: body.content,
    categories: body.categories,
    tags: body.tags ?? body.tag ?? [],
    imgUrls: body.imgUrls ?? body.imageUrls ?? [],
  };
}

// POST /style-update 핸들러
async function updateStyle(req, res, next) {
  try {
    const payload = normalizeStyleBody(req.body);
    // ...existing code... (유효성 검사 등)
    const result = await styleService.update(payload); // 기존 업데이트 서비스에 위임
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

// ...existing code...
module.exports = {
  // ...existing exports...
  updateStyle,
};