import express from 'express';
import { createComment } from './comment.controller.js';

const router = express.Router();

router
  .route('/:curationId/comments')
  //post
  .post(createComment);

export default router;
