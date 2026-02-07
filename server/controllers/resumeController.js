import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';


// controller for creating a new resume
// POST: /api/resumes/create
//Creates a new empty resume for the logged-in user.
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        //Comes from protect middleware Identifies which user is creating the resume
        const {title} = req.body;
        //Gets resume title from frontend

        // create new resume,Creates a new document in MongoDB
        const newResume = await Resume.create({userId, title})
        // we have created a mongoose model earlier in resume.js
        //A model represents: a MongoDB collection (resumes) ,plus rules about what a document looks like


        // return success message
        return res.status(201).json({message: 'Resume created successfully', resume: newResume})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for deleting a resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

       await Resume.findOneAndDelete({userId, _id: resumeId})
       // we have deleted the one with the given userId and then deleted it 

        // return success message
        return res.status(200).json({message: 'Resume deleted successfully'})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


// get user resume by id
// GET: /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

       const resume = await Resume.findOne({userId, _id: resumeId})

       if(!resume){
        return res.status(404).json({message: "Resume not found"})
       }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// get resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        // resume should be public and then search for ID
        const resume = await Resume.findOne({public: true, _id: resumeId})

        if(!resume){
            // if we cannot find it, we remove it 
        return res.status(404).json({message: "Resume not found"})
       }

       return res.status(200).json({resume})
    } catch (error) {
         return res.status(400).json({message: error.message})
    }
}

// controller for updating a resume
// PUT: /api/resumes/update
// async because it talks to DB + ImageKit
export const updateResume = async (req, res) =>{
    try {
        const userId = req.userId;
        //Comes from protect middleware
        //protect adds userId to the request object.
        //Ensures user can update only their own resume
        // userRouter.get('/resumes', protect, getUserResumes), 
        const {resumeId, resumeData, removeBackground} = req.body
        // resumeId → which resume to update
        //resumeData → updated resume content
        //removeBackground → whether to remove image background
        //image → uploaded image file (via Multer)
        const image = req.file;
        
        let resumeDataCopy; 
        //When using FormData:  Objects are sent as strings and  Files come as req.file
        // So resumeData may be:  a JSON string  or already an object
        // so we handle both cases individually 
        if(typeof resumeData === 'string'){
            resumeDataCopy = await JSON.parse(resumeData)
        }else{
            resumeDataCopy = structuredClone(resumeData)
        }
        //resumeDataCopy is always a safe, mutable object Avoids mutating req.body directly

        if(image){
            

            const imageBufferData = fs.createReadStream(image.path)
            //It is a stream of the uploaded image file
            //Streams are efficient for large files
            //Multer temporarily stores file locally This creates a stream to upload it
            //Imagekit accepts buffers, streams 


            // here we have imported it from imagekit folder by saying imagekit.files
            //await because file upload is a network operation
            const response = await imagekit.files.upload({
                            file: imageBufferData,
                            //This is the actual image content.
                            fileName: 'resume.png',
                            //Name under which the file is stored in ImageKit
                            folder: 'user-resumes',
                            //Organizes files in ImageKit dashboard
                             transformation: {
                                pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
                             }
                            });
                            //Uploads a file to ImageKit’s cloud storage
                            //Returns metadata about the uploaded file
//This code uploads an image to ImageKit, applies image transformations,
// and returns a public URL that you store in the resume.
//Take the uploaded image → process it → store it in the cloud → get a URL.

            // in response we get a live url for our image that we have uploaded 
            resumeDataCopy.personal_info.image = response.url
        }

       const resume = await Resume.findByIdAndUpdate({userId, _id: resumeId}, resumeDataCopy, {new: true})
       //Finds resume by: resumeId userId (security check) Updates it with new data 
       //{ new: true } → return updated document

       return res.status(200).json({message: 'Saved successfully', resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}




// used to update, delete, create, getResumeByID, getPublicResume