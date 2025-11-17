import express from 'express';
import cors from 'cors';
import { PORT } from './lib/constants.js';
import commentRouter from './routers/comment.router.js';

const app = express();

app.use(express.json());
app.use(cors());

<<<<<<< HEAD
=======
app.use('/curations', commentRouter);

>>>>>>> 35f7bc7 (🔧 fix(comment): 잘못된 app.use 경로를 올바르게 수정)
app.listen(PORT, () => {
  console.log('Server Start');
});
