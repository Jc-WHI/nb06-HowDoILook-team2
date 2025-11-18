import express from 'express';
import {
  createComment,
  updateComment,
  deleteComment,
} from './../controllers/comment.controller.js';
import { withAsync } from '../lib/withAsync.js';

const router = express.Router();

router
  .route('/:curationId/comments')
  //post
  .post(withAsync(createComment));

router
  .route('/:commentId')
  //PUT
  .put(withAsync(updateComment));

router
  .route('/:commentId')
  //delete
  .delete(withAsync(deleteComment));

export default router;
