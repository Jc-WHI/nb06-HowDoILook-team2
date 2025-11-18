import express from 'express';
import { deleteStyle, styleListGallery, styleListRank } from '../controllers/styleController.js';
import { withAsync } from '../lib/withAsync.js';
import { createStyle } from '../controllers/styleController.js';
const styleRouter = express.Router();

styleRouter.get('/styles', withAsync(styleListGallery));
styleRouter.get('/ranking', withAsync(styleListRank));
styleRouter.get('/ranking', withAsync(styleListRank));
styleRouter.post('/styles', withAsync(createStyle));
styleRouter.delete('/styles/:styleId', withAsync(deleteStyle));

export default styleRouter;
