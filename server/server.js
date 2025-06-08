import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhook, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRouter.js';

const app=express();
await connectDB()
await connectCloudinary()
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())
app.get('/',(req,res)=>res.send("api is working"))
app.post('/clerk',express.json(),clerkWebhook)
app.use('/api/educator',educatorRouter)
app.use('/api/course',courseRouter)
app.use('/api/user',userRouter)
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})