import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
//Takes a rough professional summary and rewrites it to be stronger, ATS-friendly, and concise
// export const enhanceProfessionalSummary = async (req, res) => {
//     try {
//         const { userContent } = req.body;
//         //userContent = text written by the user

//         if(!userContent){
//             return res.status(400).json({message: 'Missing required fields'})
//             //Validation: AI should not run on empty input
//         }
        
//         //This sends a chat-style prompt to OpenAI.
//         //in-built function, taken directly from documentation 
//        const response = await ai.chat.completions.create({
//             model: process.env.OPENAI_MODEL,
//             // the model which we have chooses
//             messages: [
//                 { role: "system", content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else." },
//                 {
//                     role: "user",
//                     content: userContent,
//                 },
//                 // the above is the prompt for the LLM, as how to solve it 
//     ],
//         })
        
//         //AI responses come as an array of choices.You take the first one
//         const enhancedContent = response.choices[0].message.content;
//         return res.status(200).json({enhancedContent})
//         //Frontend receives clean improved text.
//     } catch (error) {
//         return res.status(400).json({message: error.message})
//     }
// }
// the above was giving issue for gemini so I remove this and wriiting the below one 

// Controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        // Extract text written by user from request body
        const { userContent } = req.body;

        // Basic validation — AI should not run on empty input
        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // We create a single prompt string for Gemini
        // Unlike OpenAI chat format, Gemini SDK takes a plain text prompt
        const prompt = `
You are an expert resume writer.

Your task is to enhance the following professional summary.
Make it compelling, ATS-friendly, and limited to 1-2 sentences only.
Return only the improved text.

Professional Summary:
${userContent}
`;

        // Call Gemini model using official SDK
        // generateContent() sends prompt to Gemini
        const result = await ai.generateContent(prompt);

        // Gemini returns a structured response object
        // We extract plain text output using response.text()
        const enhancedContent = result.response.text();

        // Send improved content back to frontend
        return res.status(200).json({ enhancedContent });

    } catch (error) {
        // Log full error in backend terminal (for debugging)
        console.log("AI ERROR:", error);

        // Send error message to frontend
        return res.status(400).json({ message: error.message });
    }
};















// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
//Improves a job description into impactful, results-driven bullet-style content.
// export const enhanceJobDescription = async (req, res) => {
//     try {
//         const { userContent } = req.body;

//         if(!userContent){
//             return res.status(400).json({message: 'Missing required fields'})
//         }

//        const response = await ai.chat.completions.create({
//             model: process.env.OPENAI_MODEL,
//             messages: [
//                 { role: "system",
//                  content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else." },
//                 {
//                     role: "user",
//                     content: userContent,
//                 },
//     ],
//         })

//         const enhancedContent = response.choices[0].message.content;
//         return res.status(200).json({enhancedContent})
//     } catch (error) {
//         return res.status(400).json({message: error.message})
//     }
// }
//above was causing issue so remove it with below for gemini key 

// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        // Extract job description written by user
        const { userContent } = req.body;

        // Basic validation
        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Gemini uses a plain text prompt instead of chat format
        const prompt = `
You are an expert resume writer.

Your task is to enhance the following job description.
Make it powerful, results-driven, ATS-friendly,
and limited to 1-2 sentences only.
Use strong action verbs and quantifiable impact if possible.
Return only the improved text.

Job Description:
${userContent}
`;

        // Call Gemini model
        const result = await ai.generateContent(prompt);

        // Extract clean text output
        const enhancedContent = result.response.text();

        // Send back to frontend
        return res.status(200).json({ enhancedContent });

    } catch (error) {
        console.log("AI ERROR:", error);
        return res.status(400).json({ message: error.message });
    }
};








// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
// export const uploadResume = async (req, res) => {
//     try {
       
//         const {resumeText, title} = req.body;
//         // the resumeText that people will uoload and title will also come from there 
//         const userId = req.userId;
//         //resumeText → full plain-text resume
// //title → resume title
// //userId → from auth middleware (secure)

//         if(!resumeText){
//             return res.status(400).json({message: 'Missing required fields'})
//             //AI can’t extract data without text.
//         }

//         const systemPrompt = "You are an expert AI Agent to extract data from resume."
//         //Defines the AI’s role.

//         const userPrompt = `extract data from this resume: ${resumeText}

        
//         Provide data in the following JSON format with no additional text before or after:

//         {
//         professional_summary: { type: String, default: '' },
//         skills: [{ type: String }],
//         personal_info: {
//             image: {type: String, default: '' },
//             full_name: {type: String, default: '' },
//             profession: {type: String, default: '' },
//             email: {type: String, default: '' },
//             phone: {type: String, default: '' },
//             location: {type: String, default: '' },
//             linkedin: {type: String, default: '' },
//             website: {type: String, default: '' },
//         },
//         experience: [
//             {
//                 company: { type: String },
//                 position: { type: String },
//                 start_date: { type: String },
//                 end_date: { type: String },
//                 description: { type: String },
//                 is_current: { type: Boolean },
//             }
//         ],
//         project: [
//             {
//                 name: { type: String },
//                 type: { type: String },
//                 description: { type: String },
//             }
//         ],
//         education: [
//             {
//                 institution: { type: String },
//                 degree: { type: String },
//                 field: { type: String },
//                 graduation_date: { type: String },
//                 gpa: { type: String },
//             }
//         ],          
//         }
//         `;
//         // how you want things to be, you explicatally tell the ai, forces ai to return 
//         //valud JSON which we can process 

//        const response = await ai.chat.completions.create({
//             model: process.env.OPENAI_MODEL,
//             messages: [
//                 { role: "system",
//                  content: systemPrompt },
//                 {
//                     role: "user",
//                     content: userPrompt,
//                 },
//         ],
//         response_format: {type:  'json_object'}
//         })

//         const extractedData = response.choices[0].message.content;
//         const parsedData = JSON.parse(extractedData)
//         //Extract and parse AI output
//         const newResume = await Resume.create({userId, title, ...parsedData})
//         //this:Creates a real resume document.Links it to the user.Stores all AI-extracted fields

//         res.json({resumeId: newResume._id})
//         //Knows the resume was created
//         //can redirect to this new resume 
//     } catch (error) {
//         // for checking, please remove at end
//         console.log("====== AI ERROR START ======");
//     console.log("FULL ERROR:", error);
//     console.log("ERROR MESSAGE:", error.message);
//     console.log("ERROR RESPONSE:", error.response?.data);
//     console.log("====== AI ERROR END ======");

//         return res.status(400).json({message: error.message})
//     }
// }
//above 

// Controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        // Extract data sent from frontend
        const { resumeText, title } = req.body;

        // userId was attached earlier by protect middleware
        const userId = req.userId;

        // Basic validation — we cannot process empty resume text
        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        /*
        ------------------------------------------------------
        We now build ONE large prompt string for Gemini.

        Important:
        Gemini does NOT support OpenAI-style structured output.
        So we force it using strict prompt instructions.

        We:
        - Tell it to return ONLY JSON
        - Tell it not to add markdown
        - Define exact structure
        ------------------------------------------------------
        */

        const prompt = `
You are an expert AI agent that extracts structured resume data.

Extract data from the following resume text and return ONLY valid JSON.
Do not include explanations.
Do not include markdown.
Do not include backticks.
Return only pure JSON.

Return JSON in this exact structure:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

Resume Text:
${resumeText}
`;

        /*
        ------------------------------------------------------
        Call Gemini model using official SDK
        generateContent() sends the prompt to Gemini
        ------------------------------------------------------
        */

        const result = await ai.generateContent(prompt);

        /*
        Gemini returns a structured object.
        We extract plain text output using:
        result.response.text()
        */

        const rawText = result.response.text();

        /*
        ------------------------------------------------------
        Sometimes Gemini wraps JSON inside markdown like:

        ```json
        { ... }
        ```

        That breaks JSON.parse().

        So we remove markdown safely.
        ------------------------------------------------------
        */

        const cleanedText = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        /*
        Convert text into real JavaScript object
        If JSON is invalid → this line throws error
        */

        const parsedData = JSON.parse(cleanedText);

        /*
        ------------------------------------------------------
        Create a new resume document in MongoDB

        We spread parsedData into Resume model.
        This automatically saves:
        - professional_summary
        - skills
        - personal_info
        - experience
        - project
        - education
        ------------------------------------------------------
        */

        const newResume = await Resume.create({
            userId,
            title,
            ...parsedData,
        });

        // Send newly created resume ID back to frontend
        return res.json({ resumeId: newResume._id });

    } catch (error) {

        /*
        If ANYTHING fails:
        - Gemini error
        - JSON parse error
        - DB error
        It will come here
        */

        console.log("====== AI ERROR START ======");
        console.log("FULL ERROR:", error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("====== AI ERROR END ======");

        return res.status(400).json({ message: error.message });
    }
};


//. It exposes AI-powered endpoints that enhance resume content and even create a resume automatically from raw text. I
// This controller uses OpenAI (via ai) to:
// Improve a professional summary
// Improve a job description
// Parse a full resume text and convert it into structured resume data, then save it to MongoDB

