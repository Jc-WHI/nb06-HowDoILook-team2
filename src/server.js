import express from 'express';
import cors from 'cors';
import { PORT } from './lib/constants.js';
import commentRouter from './routers/comment.router.js';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log('Server Start');
});
