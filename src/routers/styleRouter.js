import express from 'express';
import { styleListGallery, styleListRank } from '../controllers/styleGetController.js';
import { withAsync } from '../lib/withAsync.js';
const styleRouter = express.Router();

export default styleRouter;
