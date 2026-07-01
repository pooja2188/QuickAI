import express from 'express';
import { auth } from '../middlewares/auth.js'; 
import { getPublishedCreation, getUserCreation, toggleCreation } from '../controllers/userController.js';
const userRouter=express.Router();
userRouter.get('/get-user-creations',auth,getUserCreation)
userRouter.get('/get-published-creations',auth,getPublishedCreation)
userRouter.post('/toggle-like-creation',auth,toggleCreation)
export default userRouter