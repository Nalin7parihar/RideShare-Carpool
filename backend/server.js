import express from 'express';
import 'dotenv/config';
import connectDB from './config/mongoDB.js';
import userRoute from './routes/user.route.js';
import cors from 'cors';
const app = express();

connectDB();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());


app.get('/',(req,res) =>{
  res.send('API is running...');
});

app.use('/api/users',userRoute);

app.listen(port, () => {
  console.log(`Server launched on port ${port}`);
});

