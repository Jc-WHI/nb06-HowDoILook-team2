import express from 'express';
import dotenv from 'dotenv';
import styleGetList from './src/apis/styles/styleGetList.js';
import styleUpdate from './src/apis/styles/styleUpdate.js';
import styleDelete from './src/apis/styles/styleDelete.js';
import styleRouter from './src/routers/styleRouter.js'
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(styleRouter);



app.listen(PORT, () => {
  console.log('Server Start');
});
