import express from 'express';
import dotenv from 'dotenv';
import styleGetList from './src/apis/styles/styleGetList.js';
import styleUpdate from './src/apis/styles/styleUpdate.js';
import styleDelete from './src/apis/styles/styleDelete.js';
const router = express.Router();
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.patch("/api/styles/:styleId",async (req,res) =>{
  await styleUpdate(req,res);
  


 
})
app.delete("/apis/styles/:styleId",async(req,res)=>{
  await styleDelete(req,res);
})


app.listen(PORT, () => {
  console.log('Server Start');
});
