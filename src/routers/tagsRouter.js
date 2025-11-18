import { Router } from 'express';
import { getPopularTags } from '../controllers/getPopularTags.js';

const tagsRouter = Router();

tagsRouter.get('/tags', getPopularTags);

export default tagsRouter;
