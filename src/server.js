import express from 'express';
import cors from 'cors';
import { PORT } from './lib/constants.js';
import commentRouter from './routers/comment.router.js';
import styleRouter from './routers/styleRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from '../src/controllers/errorController.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', styleRouter);
app.use('/curations', commentRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log('Server Start');
});
