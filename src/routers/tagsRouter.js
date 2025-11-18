import { Router } from 'express';
import { getPopularTags } from '../controllers/tagController.js';
import { withAsync } from '../lib/withAsync.js';

const tagsRouter = Router();

tagsRouter.get('/tags', withAsync(getPopularTags));

export default tagsRouter;
