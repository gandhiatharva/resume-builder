// this was before, we removed this code as it was showing error as using openAI, 
//now below code is for gemini
// import OpenAI from "openai";

// const ai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     baseURL: process.env.OPENAI_BASE_URL,
// });

// export default ai



import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
});

export default model;
