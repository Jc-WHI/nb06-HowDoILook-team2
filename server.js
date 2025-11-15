import express from 'express';
import cors from 'cors';
import { PORT } from './src/lib/constants.js';
import curateRouter from './src/routers/curateRouter.js';
import { defaultNotFoundHandler, globalErrorHandler } from './src/controllers/errorController.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(curateRouter);
app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log('Server Start');
});
