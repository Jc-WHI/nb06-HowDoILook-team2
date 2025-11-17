import express from 'express';
import { styleGetId } from '../controllers/styleGetController.js';
import { withAsync } from '../lib/withAsync.js';
const styleRouter = express.Router();

styleRouter.get('/styles/:styleId', withAsync(styleGetId));

export default styleRouter;
