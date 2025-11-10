import express from 'express';
import cors from 'cors';
import { PORT } from './lib/constants.js';
import styleRouter from './routers/StyleRouter.js';

const app = express();

app.use(express.json());
app.use(cors());

//test

app.use(styleRouter);

app.listen(PORT, () => {
  console.log('Server Start');
});
