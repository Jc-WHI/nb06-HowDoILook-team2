import express from 'express';
import {
  deleteStyle,
  styleGetId,
  styleListGallery,
  styleListRank,
  styleUpdate,
} from '../controllers/styleController.js';
import { withAsync } from '../lib/withAsync.js';
import { createStyle } from '../controllers/styleController.js';
const styleRouter = express.Router();

styleRouter.get('/styles', withAsync(styleListGallery));
styleRouter.get('/ranking', withAsync(styleListRank));
styleRouter.get('/styles/:styleId', withAsync(styleGetId));
styleRouter.post('/styles', withAsync(createStyle));
styleRouter.delete('/styles/:styleId', withAsync(deleteStyle));
styleRouter.put('/styles/:styleId', withAsync(styleUpdate));

export default styleRouter;
