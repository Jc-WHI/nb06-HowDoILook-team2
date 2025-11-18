import express from 'express';
import { createComment } from './../controllers/comment.controller.js';
import { withAsync } from '../lib/withAsync.js';

const router = express.Router();

router
  .route('/:curationId/comments')
  //post
  .post(withAsync(createComment));

export default router;
