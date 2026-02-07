import multer from "multer";


const storage = multer.diskStorage({});
//the above line tells multer to Store uploaded files on disk using default settings.
// since we did'nt specify destination and fileName, multer saves files to a temporary system folder,Generates a random filename

const upload = multer({storage})
//This creates a middleware function that:
//Parses multipart/form-data
//Extracts files
//Attaches them to req.file or req.files

export default upload


// Multer is an Express middleware used to handle:
// multipart/form-data (mainly file uploads)
// Browsers use multipart/form-data when:
// uploading images
// uploading files
// sending files + form fields together
// Without Multer:
// req.file / req.files do not exist
// Express can’t read uploaded files


// so the flow is ->
// Frontend (FormData + file)
// → Express route
// → Multer middleware
// → Controller
