import express from 'express';
import { styleListGallery } from '../controllers/styleGetController.js';

const styleRouter = express.Router();

styleRouter.get('/', styleListGallery);

export default styleRouter;
