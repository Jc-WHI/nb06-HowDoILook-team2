import express from 'express';
import cors from 'cors';
import { PORT } from './lib/constants.js';
import commentRouter from './routers/commentRouter.js';
import styleRouter from './routers/styleRouter.js';
import curateRouter from './routers/curateRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController.js';
import imageRouter from './routers/imageRouter.js';
import tagsRouter from './routers/tagsRouter.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.use(styleRouter);
app.use(commentRouter);
app.use(curateRouter);
app.use(imageRouter);
app.use(tagsRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log('Server Start');
});
