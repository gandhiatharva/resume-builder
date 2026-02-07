import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
// in create we need protect so that only a loggedIn user can create 
resumeRouter.put('/update',protect, upload.single('image'),updateResume);
// to upload image via imageKit we used upload.single property which acted as a middleware
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
// if public then we dont need protect as anyone can see this 

export default resumeRouter


//this file is directly and completely linked to resumeController.js.
