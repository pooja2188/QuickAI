import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware,requireAuth } from '@clerk/express'; // REMOVED requireAuth from here
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();
await connectCloudinary
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());  
app.use(express.json());
app.use(clerkMiddleware()); // This populates req.auth() safely for all downstream routes


app.get('/', (req, res) => res.send('Server is Live!'));

app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
