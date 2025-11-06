import express from 'express';
import dotenv from 'dotenv';
import styleGetList from './src/apis/styles/styleGetList.js';
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use('/styles', styleGetList);

app.listen(PORT, () => {
  console.log('Server Start');
});
