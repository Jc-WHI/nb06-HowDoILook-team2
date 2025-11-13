
const express = require('express');
const router = express.Router();

const styleController = require('../controllers/style.controller');

// 스타일 업데이트(별칭) 라우트 추가: POST /style-update
router.post('/style-update', styleController.updateStyle);

module.exports = router;