import express from 'express';
import { styleListGallery, styleListRank, styleGetId } from '../controllers/styleGetController.js';
const styleRouter = express.Router();

styleRouter.get('/styles', styleListGallery);
styleRouter.get('/ranking', styleListRank);
styleRouter.get('/style/:styleId', styleGetId);

export default styleRouter;
