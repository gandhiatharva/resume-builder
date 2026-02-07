import express from "express";
import { getUserById, getUserResumes, loginUser, registerUser } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
//This creates a mini Express app just for user routes.

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
//No middleware
//Anyone can access these routes
//Required because users are not logged in yet


userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes)
//the above two are Protected routes (WITH middleware)
//Routes run left to right.
//Request → protect middleware → getUserById controller
//so express matches the route, calles protect, which reads the tokens,verifies it and then calls next()
//COntroller uses req.userId to fetch user data
//Response is sent back
//it is written in middle because protect runs only for this route Other routes are unaffected


export default userRouter;