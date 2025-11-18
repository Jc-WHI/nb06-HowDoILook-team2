import express from 'express';
import { createComment, updateComment, deleteComment } from './../controllers/commentController.js';
import { withAsync } from '../lib/withAsync.js';

const router = express.Router();

router
  .route('/curations/:curationId/comments')
  //post
  .post(withAsync(createComment));

router
  .route('/comments/:commentId')
  //PUT
  .put(withAsync(updateComment));

router
  .route('/comments/:commentId')
  //delete
  .delete(withAsync(deleteComment));

export default router;
