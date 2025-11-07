import express from 'express';
import { creatComment } from './comment.controller.js';

const router = express.Router();

router
  .route('/:curationId/comments')
  //post
  .post(creatComment);

export default router;
