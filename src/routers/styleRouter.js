import express from 'express';
import { styleListGallery, styleListRank } from '../controllers/styleGetController.js';
const styleRouter = express.Router();

styleRouter.get('/styles', styleListGallery);
styleRouter.get('/ranking', styleListRank);
export default styleRouter;
