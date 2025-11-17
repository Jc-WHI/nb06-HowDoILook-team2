import express from 'express';
import { styleListGallery, styleListRank } from '../controllers/styleGetController.js';
import { withAsync } from '../lib/withAsync.js';
const styleRouter = express.Router();

styleRouter.get('/styles', withAsync(styleListGallery));
styleRouter.get('/ranking', withAsync(styleListRank));

export default styleRouter;
