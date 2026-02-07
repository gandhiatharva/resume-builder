// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         mongoose.connection.on("connected", ()=>{console.log("Database connected successfully")})

//         let mongodbURI = process.env.MONGODB_URI;
//         const projectName = 'resume_builder';

//         if(!mongodbURI){
//             throw new Error("MONGODB_URI environment variable not set")
//         }

//         if(mongodbURI.endsWith('/')){
//             mongodbURI = mongodbURI.slice(0, -1)
//         }

//         await mongoose.connect(`${mongodbURI}/${projectName}`)
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error)
//     }
// }

// export default connectDB;

import mongoose from "mongoose";
//Mongoose is the ODM (Object Data Modeling) library It manages the MongoDB connection and schemas

const connectDB = async () => {
    // Async function because DB connection is a network operation
    try {
        mongoose.connection.on("connected", () => {
            // whenever application will be connected with DB, then this will be execuited 
            console.log("Database connected successfully");
        });

        const mongodbURI = process.env.MONGODB_URI;
        // Reads DB URL from environment variables

        if (!mongodbURI) {
            throw new Error("MONGODB_URI environment variable not set");
            // Prevents calling mongoose.connect() with undefined
            // Fails fast if .env is misconfigured
        }

        await mongoose.connect(mongodbURI);
        // Opens a connection to MongoDB

        // `If successful:Triggers "connected" event
        // If it fails: Throws an error → caught below`
    } catch (error) {
        // will help catch any kind of error like invalid url, network errors, auth failures    
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;


// Connect your Node.js backend to MongoDB using Mongoose and log the connection status.
