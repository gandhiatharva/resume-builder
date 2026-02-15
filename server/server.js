import express from "express";
//express → framework to create the backend server
import cors from "cors";
//cors → allows frontend (different origin) to call this backend
import "dotenv/config";
//dotenv/config → loads environment variables from .env
import connectDB from "./configs/db.js";
//connectDB → function that connects to your database (MongoDB most likely)
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
//userRouter / resumeRouter / aiRouter → route files that contain API endpoints

const app = express();
//this will create backend application instance 
const PORT = process.env.PORT || 3000;
// uses port from env if given there otherwise used 3000 for local development 

// Database connection, we made it configs/db.js where we have given info related to the 
//configuration of the database 
await connectDB()
//Establishes a database connection before the server starts
// If DB fails → server should not run,Uses top-level await (ES modules)

app.use(express.json())
//Parses incoming JSON request bodies Allows you to read req.body



app.use(cors())
//Enables Cross-Origin Resource Sharing Allows frontend (React) to call backend APIs



app.get('/', (req, res)=> res.send("Server is live..."))
//Simple endpoint to confirm server is running, used for testing 
app.use('/api/users', userRouter)
//All user-related routes live under /api/usersExample: /api/users/login
app.use('/api/resumes', resumeRouter)
//Resume CRUD APIs. Example: /api/resumes/create
app.use('/api/ai', aiRouter)
//AI-related endpoints (resume summary, skills, etc.)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
});
//Starts the HTTP server Begins listening for incoming requests Logs confirmation in terminal



// this is the mail file to start our backend server 
// server.js is the central traffic controller of the backend.
//start the server, connect the database, and delegate requests to the correct route files.
