import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';

import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express(); 
app.use(express.json());

const allowedOrigins = [
  'https://node-connect-yzx7.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(postRoutes);

app.use(userRoutes);
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 9080;
const start = async() =>{
    fs.mkdirSync('uploads', { recursive: true });
    const connectDB = await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
        console.log('Connected to MongoDB');
    })
}

start();