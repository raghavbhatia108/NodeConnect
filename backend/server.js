import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express(); 
app.use(express.json());
app.use(cors());
app.use(postRoutes);

app.use(userRoutes);
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 9080;
const start = async() =>{
    const connectDB = await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
        console.log('Connected to MongoDB');
    })
}

start();