import express from 'express';
import { creatReply } from './reply.controller.js';

const router = express.Router();

router
  .route('/:curatingId/reply')
  //post
  .post(creatReply);
