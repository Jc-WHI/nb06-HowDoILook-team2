import { Router } from 'express';
import upload from '../upload.js';
import { uploadSingleImage } from '../controllers/imageController.js';
import { withAsync } from '../lib/withAsync.js';

const imageRouter = Router();

imageRouter.post('/images', upload.single('image'), withAsync(uploadSingleImage));

export default imageRouter;
